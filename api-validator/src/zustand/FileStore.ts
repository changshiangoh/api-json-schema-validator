import { create } from "zustand";
import { devtools } from "zustand/middleware";

type State = {
    controllerFileName: string;
    controllerFile: string;
    relevantObjectsName: string;
    relevantObjects: string;
    schemaFileName: string;
    schemaFile: string;
};

type Actions = {
    setControllerFileName: (file: string) => void;
    setControllerFile: (file: string) => void;
    setRelevantObjectsName: (objects: string) => void;
    setRelevantObjects: (objects: string) => void;
    setSchemaFileName: (schema: string) => void;
    setSchemaFile: (schema: string) => void;
};

const fileStore = (set: any) => ({
  controllerFileName: '',
  relevantObjectsName: '',
  schemaFileName: '',
  controllerFile: '',
  relevantObjects: '',
  schemaFile: '',
  setControllerFileName: (file: string) => set({ controllerFileName: file }),
  setRelevantObjectsName: (objects: string) => set({ relevantObjectsName: objects }),
  setSchemaFileName: (schema: string) => set({ schemaFileName: schema }),
  setControllerFile: (file: string) => set({ controllerFile: file }),
  setRelevantObjects: (objects: string) => set({ relevantObjects: objects }),
  setSchemaFile: (schema: string) => set({ schemaFile: schema }),
});

const useFileStore = create(devtools<State & Actions>(fileStore));

export default useFileStore;