import torch
import torch.nn as nn
from torchvision.datasets import ImageFolder
from torchvision import transforms
from torch.utils.data import random_split
from datasets import load_dataset
import numpy as np
from transformers import AutoModel, AutoImageProcessor, AutoModelForImageClassification, Trainer, TrainingArguments, EarlyStoppingCallback
from torchvision.transforms import (
    CenterCrop,
    Compose,
    Normalize,
    RandomHorizontalFlip,
    RandomResizedCrop,
    Resize,
    ToTensor,
)
from evaluate import load


metric = load("accuracy")

# Define Transformer Models
MODEL_NAMES = {
    "dino_v2": "facebook/dinov2-base",
    "swin": "microsoft/swin-tiny-patch4-window7-224",
    "vit": "google/vit-base-patch16-224"
}

def compute_metrics(eval_pred):
    """Computes accuracy on a batch of predictions"""
    predictions = np.argmax(eval_pred.predictions, axis=1)
    return metric.compute(predictions=predictions, references=eval_pred.label_ids)

def collate_fn(examples):
    pixel_values = torch.stack([example["pixel_values"] for example in examples])
    labels = torch.tensor([example["label"] for example in examples])
    return {"pixel_values": pixel_values, "labels": labels}

dataset = load_dataset("imagefolder", data_dir="./data/training_data")

labels = dataset["train"].features["label"].names
label2id, id2label = dict(), dict()
for i, label in enumerate(labels):
    label2id[label] = i
    id2label[i] = label

print(id2label[2])

def transform_ds(image_processor):
    splits = dataset["train"].train_test_split(test_size=0.2)
    train_ds = splits['train']
    val_ds = splits['test']
    
    normalize = Normalize(mean=image_processor.image_mean, std=image_processor.image_std)
    
    if "height" in image_processor.size:
        size = (image_processor.size["height"], image_processor.size["width"])
        crop_size = size
        max_size = None
    elif "shortest_edge" in image_processor.size:
        size = image_processor.size["shortest_edge"]
        crop_size = (size, size)
        max_size = image_processor.size.get("longest_edge")

    train_transforms = Compose(
            [
                RandomResizedCrop(crop_size),
                RandomHorizontalFlip(),
                ToTensor(),
                normalize,
            ]
        )
    
    val_transforms = Compose(
            [
                Resize(size),
                CenterCrop(crop_size),
                ToTensor(),
                normalize,
            ]
        )
    
    def preprocess_train(example_batch):
        """Apply train_transforms across a batch."""
        example_batch["pixel_values"] = [
            train_transforms(image.convert("RGB")) for image in example_batch["image"]
        ]
        return example_batch
    
    def preprocess_val(example_batch):
        """Apply val_transforms across a batch."""
        example_batch["pixel_values"] = [val_transforms(image.convert("RGB")) for image in example_batch["image"]]
        return example_batch

    train_ds.set_transform(preprocess_train)
    val_ds.set_transform(preprocess_val)
    return train_ds, val_ds

# Fine-Tune Model for All Models
def train_all_models(batch_size=32):
    for model_type in MODEL_NAMES:
        print(f"Starting training for {model_type}...")
        
        # Load Model
        model_name = MODEL_NAMES[model_type]
        
        image_processor  = AutoImageProcessor.from_pretrained(model_name)

    
        
        model = AutoModelForImageClassification.from_pretrained(
            model_name,
            label2id=label2id,
            id2label=id2label,
            ignore_mismatched_sizes = True, # provide this in case you're planning to fine-tune an already fine-tuned checkpoint
        )

        
        
        # Define Training Arguments
        training_args = TrainingArguments(
            output_dir=f"{model_type}-finetuned-dermnet",
            remove_unused_columns=False,
            eval_strategy ="epoch",
            save_strategy="epoch",
            learning_rate=5e-5,
            per_device_train_batch_size=batch_size,
            gradient_accumulation_steps=2,
            per_device_eval_batch_size=batch_size,
            num_train_epochs=10,
            warmup_ratio=0.1,
            logging_steps=10,
            load_best_model_at_end=True,
            metric_for_best_model="accuracy",
            fp16=True,
        )

        train_dataset, val_dataset = transform_ds(image_processor)

        # Initialize Trainer & Start Training
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            tokenizer=image_processor,
            compute_metrics=compute_metrics,
            data_collator=collate_fn,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
        )
        train_results = trainer.train()
        trainer.save_model()
        trainer.log_metrics("train", train_results.metrics)
        trainer.save_metrics("train", train_results.metrics)
        trainer.save_state()
        
        print(f"Finished training {model_type}.\n")

if __name__ == "__main__":
    train_all_models()