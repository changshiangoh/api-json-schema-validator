import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
    controllerFile: string;
    relevantObjects: string;
    schema: string;
};

type Actions = {
    setControllerFile: (file: string) => void;
    setRelevantObjects: (objects: string) => void;
    setSchema: (schema: string) => void;
};

const fileStore = (set: any) => ({
  controllerFile: '',
  relevantObjects: '',
  schema: '',
  setControllerFile: (file: string) => set({ controllerFile: file }),
  setRelevantObjects: (objects: string) => set({ relevantObjects: objects }),
  setSchema: (schema: string) => set({ schema: schema }),
});

const useFileStore = create(devtools<State & Actions>(fileStore));

export default useFileStore;