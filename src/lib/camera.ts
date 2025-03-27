/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
import { showError } from './message';

export const getCameraList = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    return cameras;
  } catch (error) {
    showError('Error getting camera list:');
  }
};

export const detectFrontBackCamera = (cameras) => {
  const frontCameras = cameras.filter((camera) => (
    camera.facingMode === 'user'
    || (camera.label && camera.label.toLowerCase().includes('front'))
  ));

  const backCameras = cameras.filter((camera) => (
    camera.facingMode === 'environment'
    || (camera.label && camera.label.toLowerCase().includes('back'))
  ));

  return {
    frontCameras,
    backCameras
  };
};

export const identifyMainCamera = async (cameras) => {
  let mainCamera;
  for (const camera of cameras) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { width, height } = await camera.getCapabilities();
      // eslint-disable-next-line no-unsafe-optional-chaining
      const resolution = width?.max * height?.max;

      if (!mainCamera) {
        mainCamera = Object.assign(camera, resolution);
      } else if (resolution > mainCamera.resolution) {
        mainCamera = Object.assign(camera, resolution);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  return mainCamera;
};
