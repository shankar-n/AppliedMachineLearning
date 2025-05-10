import {
  Geolocation,
  PermissionStatus as LocationPermissionStatus,
} from "@capacitor/geolocation";
import {
  Filesystem,
  PermissionStatus as FileSystemPermissionStatus,
} from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";

// Function to dynamically request permissions
export const requestPermissions = async () => {
  try {
    // Request Location Permission
    const locationStatus: LocationPermissionStatus =
      await Geolocation.requestPermissions();
    console.log("Location Permission:", locationStatus);

    // Request FileSystem Permission (only needed for Android)
    const fileSystemStatus: FileSystemPermissionStatus =
      await Filesystem.requestPermissions();
    console.log("Filesystem Permission:", fileSystemStatus);

    // Ensure Google Maps API key is provided (for usage, not for permission handling)
    const googleMapsPermission =
      Capacitor.getPlatform() === "web"
        ? "Granted (Handled by Browser)"
        : "Requires API Key";
    console.log("Google Maps Permission:", googleMapsPermission);

    return {
      location: locationStatus,
      filesystem: fileSystemStatus,
      googleMaps: googleMapsPermission,
    };
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return null;
  }
};
