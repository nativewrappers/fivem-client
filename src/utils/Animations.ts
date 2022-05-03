import { Wait } from '..';

/**
 * A utility to load an animation dictionary, anything that loads an animation should RemoveAnimDict after its finish being used.
 * @param animDict the animation dictionary to load
 * @param waitTime how long to wait for the dictionary to load
 * @returns {boolean} if the animation successfully loaded
 */
export const LoadAnimDict = async (animDict: string, waitTime = 1000): Promise<boolean> => {
  const start = GetGameTimer();

  if (!HasAnimDictLoaded(animDict)) {
    RequestAnimDict(animDict);
  }

  while (!HasAnimDictLoaded(animDict)) {
    if (GetGameTimer() - start >= waitTime) return false;
    await Wait(0);
  }
  return true;
};
