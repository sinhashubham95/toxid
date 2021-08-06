import firebase from 'firebase';
import { UploadResult } from '../types/upload';

class Storage {
  private readonly storage = firebase.storage();

  uploadFile = async (ref: string, file: File): Promise<UploadResult> => {
    try {
      return {
        downloadUrl: await (await this.storage.ref().child(ref).put(file)).ref.getDownloadURL(),
      };
    } catch (e) {
      return {
        error: {
          code: e.code,
          message: e.message,
        },
      };
    }
  };

  getUrl = async (ref: string): Promise<string> => {
    try {
      return (await this.storage.ref(ref).getDownloadURL()) as string;
    } catch (e) { }
    return '';
  };
}

export default new Storage();
