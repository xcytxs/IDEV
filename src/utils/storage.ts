export const saveToLocalStorage = async (key: string, data: any): Promise<void> => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving to localStorage [${key}]:`, error);
    throw error;
  }
};

export const loadFromLocalStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Error loading from localStorage [${key}]:`, error);
    return defaultValue;
  }
};