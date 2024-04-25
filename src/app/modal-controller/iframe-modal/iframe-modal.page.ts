import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Filesystem, Directory, Encoding, FileInfo } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-iframe-modal',
  templateUrl: './iframe-modal.page.html',
  styleUrls: ['./iframe-modal.page.scss'],
})
export class IframeModalPage implements OnInit {
  iframeSrc: SafeResourceUrl | undefined;

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadStoryHtml();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async loadStoryHtml() {
    const directoryPath = 'unzipped_assets';
    const directoryContents = await this.readDirectory(directoryPath);
    console.log('Directory contents:', directoryContents);

    const storyHtmlPath = directoryContents.find(filename => filename === 'story.html');
    if (!storyHtmlPath) {
      console.error('story.html file not found in the directory');
      return;
    }

    const contents = await this.readFile(`${directoryPath}/${storyHtmlPath}`);
    if (contents) {
      let blob: Blob;
      if (typeof contents === 'string') {
        blob = new Blob([contents], { type: 'text/html' });
      } else {
        blob = contents;
      }
      const url = URL.createObjectURL(blob);
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log(this.iframeSrc);
      
    } else {
      console.error('Failed to load story.html');
    }
  }
  
  async readFile(filePath: string): Promise<string | Blob | undefined> {
    try {
      const result = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
        encoding: Encoding.UTF8
      });
      return result.data;
    } catch (error) {
      console.error('Error reading file:', error);
      return undefined;
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
}
