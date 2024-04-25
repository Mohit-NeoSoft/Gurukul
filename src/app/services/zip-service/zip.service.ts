import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip';
import { Filesystem, Directory, Encoding, FileInfo } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { IframeModalPage } from 'src/app/modal-controller/iframe-modal/iframe-modal.page';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor(private http: HttpClient, private modalController: ModalController) { }

  async downloadAndUnzip(url: string): Promise<void> {
    try {
      // Clear existing directory
      await this.clearDirectory('unzipped_assets');

      const zipFileResponse = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();

      // Check if the response is undefined
      if (!zipFileResponse) {
        console.error('Empty response received from the server');
        return;
      }

      const zipFile: ArrayBuffer = zipFileResponse;
      const zip = await JSZip.loadAsync(zipFile);

      // Iterate through each file in the zip
      for (const filePath of Object.keys(zip.files)) {
        const file = zip.files[filePath];

        // Ensure parent directory exists
        const parentDirectory = `unzipped_assets/${filePath.substring(0, filePath.lastIndexOf('/'))}`;
        await this.ensureDirectoryExists(parentDirectory);

        // Save the file
        const fileData = await file.async('uint8array');
        await this.saveFile(`unzipped_assets/${filePath}`, fileData);
      }

      // Read the contents of the directory after all files are saved
      const directoryContents = await this.readDirectory('unzipped_assets');

      // Find the URI of story.html file
      const storyHtmlUri = directoryContents.find(filename => filename === 'story.html');

      // After saving and reading, open the iframe modal with the story.html URI
      if (storyHtmlUri) {
        const iframeUrl = `/DATA/unzipped_assets/${storyHtmlUri}`;
        this.openIframeModal(iframeUrl);
      } else {
        console.error('story.html file not found in the directory');
      }
    } catch (error) {
      console.error('Error downloading and unzipping file:', error);
    }
  }

  async ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
      // Check if the directory exists before attempting to create it
      const directoryExists = await this.checkDirectoryExists(directoryPath);
      if (!directoryExists) {
        await Filesystem.mkdir({
          path: directoryPath,
          directory: Directory.Data,
          recursive: true
        });
      }
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  }

  async checkDirectoryExists(directoryPath: string): Promise<boolean> {
    try {
      const result = await Filesystem.stat({
        path: directoryPath,
        directory: Directory.Data
      });
      return result.type === 'directory';
    } catch (error) {
      // If an error occurs, assume the directory does not exist
      return false;
    }
  }

  async saveFile(filePath: string, fileData: Uint8Array): Promise<void> {
    try {
      const blob = new Blob([fileData]);
      await Filesystem.writeFile({
        path: filePath,
        data: blob,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  async readDirectory(directoryPath: string): Promise<string[]> {
    try {
      const result = await Filesystem.readdir({
        path: directoryPath,
        directory: Directory.Data
      });
      // Map FileInfo objects to file names
      return result.files.map((fileInfo: FileInfo) => fileInfo.name);
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  }

  async openIframeModal(iframeSrc: string) {
    const modal = await this.modalController.create({
      component: IframeModalPage,
      componentProps: {
        iframeSrc: iframeSrc,
      }
    });
    return await modal.present();
  }

  async clearDirectory(directoryPath: string): Promise<void> {
    try {
      await Filesystem.rmdir({
        path: directoryPath,
        directory: Directory.Data,
        recursive: true // Delete directory and all its contents recursively
      });
      console.log('Directory cleared successfully:', directoryPath);
    } catch (error) {
      console.error('Error clearing directory:', error);
    }
  }
}
