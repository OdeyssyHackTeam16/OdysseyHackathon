import { Injectable } from '@angular/core';
import { create, IPFSHTTPClient } from 'ipfs-http-client';
import * as IPFS_ROOT_TYPES from 'ipfs-core-types/src/root';
import { BehaviorSubject } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private _ipfsSource = new BehaviorSubject<null | IPFSHTTPClient>(null);
  private _createIPFSNodePromise: Promise<IPFSHTTPClient>;

  constructor(private dbService: NgxIndexedDBService) {
    console.log("Connecting to local IPFS node...");
    this._createIPFSNodePromise = this.initializeIPFSNode();
  }

  private async initializeIPFSNode(): Promise<IPFSHTTPClient> {
    try {
      const node = create({ url: 'http://127.0.0.1:5001' });
      console.log('Connected to local IPFS node successfully');
      this._ipfsSource.next(node);
      return node;
    } catch (error) {
      console.error('Failed to connect to local IPFS node:', error);
      throw error;
    }
  }

  private async getIpfsInstance(): Promise<IPFSHTTPClient> {
    let node = this._ipfsSource.getValue();

    if (node == null) {
      console.log("Waiting for node connection...");
      try {
        node = await this._createIPFSNodePromise;
        this._ipfsSource.next(node);
      } catch (error) {
        console.error('Failed to connect to IPFS node:', error);
        throw error;
      }
    }

    return node!;
  }

  async getId(): Promise<IPFS_ROOT_TYPES.IDResult> {
    const node = await this.getIpfsInstance();
    return await node.id();
  }

  async getVersion(): Promise<IPFS_ROOT_TYPES.VersionResult> {
    const node = await this.getIpfsInstance();
    return await node.version();
  }

  async getStatus(): Promise<boolean> {
    const node = await this.getIpfsInstance();
    return node.isOnline();
  }

  async createDirectory(path: string): Promise<void> {
    const node = await this.getIpfsInstance();
    try {
      await node.files.mkdir(path, { parents: true });
      console.log(`Directory created at ${path}`);
    } catch (error) {
      console.error(`Failed to create directory ${path}:`, error);
    }
  }

  async fileExists(id: string, fileName: string): Promise<boolean> {
    const directoryPath = `/${id}`;
    const node = await this.getIpfsInstance();

    try {
      for await (const file of node.files.ls(directoryPath)) {
        if (file.name === fileName) {
          return true;
        }
      }
    } catch (error) {
      // Type guard to ensure error is an instance of Error
      if (error instanceof Error && error.message.includes('file does not exist')) {
        console.log("not")
        return false;
      }
      throw error;
    }
    return false;
  }
  async loadDataFromIpfsToDb(path : string) {
    try {

      // Fetch the file content from IPFS
      const fileContent = await this.getFile(path);


      // Assuming the file content is in JSON format
      const items = JSON.parse(fileContent);

      // Loop through each item and add it to the database
      for (const item of items) {
        await this.adddb(item);
      }

      console.log('Data successfully loaded from IPFS to the database.');
    } catch (error) {
      console.error('Error loading data from IPFS:', error);
    }
  }

  async adddb(item: any): Promise<void> {
    try {
      let date = new Date(item.date);
      await this.dbService.add('consumption', {
        date: date,
        total: item.total,
        consumptionPerHour: item.consumptionPerHour
      });
      console.log('Item added to database successfully.');
    } catch (error) {
      console.error('Error adding item to database:', error);
      throw error; // Rethrow the error to handle it upstream if necessary
    }
  }


  async addFile(path: string, content: string, id: string): Promise<void> {
    const node = await this.getIpfsInstance();
    let exist;
    try {
      const { cid } = await node.add(content);

      const directoryPath = `/${id}`;
      const filePath = `${directoryPath}/${path}`;
      console.log(filePath)

      console.log(`Adding file to IPFS. Directory path: ${directoryPath}, File path: ${filePath}, CID: ${cid}`);

      await this.createDirectory(directoryPath);
      const parsedContent = JSON.parse(content);
      exist = await this.fileExists(id, path)

      try {
        if (exist === false) {
          await node.files.cp(`/ipfs/${cid}`, filePath);
          console.log(`File copied to ${filePath}`);
          for (let item of parsedContent) {
            console.log("aaaaaaaaaaaaaaaa" + item.date)
            await this.adddb( item)
          }
        } else if (exist === true) {
          for (let item of parsedContent) {
            console.log("aaaaaaaaaaaaaaaa" + item.date)
            await this.adddb( item)
          }
        }
      } catch (error) {
        console.error(`Failed to copy file to ${filePath}:`, error);
      }
    }
    catch (error) {
      console.error(`Failed to copy file to :`, error);
    }
  }

  async getFile(path: string): Promise<string> {
    const node = await this.getIpfsInstance();

    const chunks: Uint8Array[] = [];

    try {
      const response = await fetch(`http://127.0.0.1:5001/api/v0/files/read?arg=${encodeURIComponent(path)}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
      const allChunks = new Uint8Array(totalLength);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      return new TextDecoder().decode(allChunks);
    } catch (error) {
      console.error(`Error reading file from IPFS path ${path}:`, error);
      throw error;
    }
  }


  async getFilesByDateRange(startDate: Date, endDate: Date): Promise<any[]> {

    return new Promise((resolve, reject) => {
      this.dbService.getAllByIndex('consumption', 'date', IDBKeyRange.bound(startDate, endDate)).subscribe({
        next: (data) => {
          console.log(`Files fetched by date range ${startDate} - ${endDate}:`, data);
          resolve(data);
        },
        error: (error) => reject(error)
      });
    });
  }

  async getalldata() {
    this.dbService.getAll('consumption').subscribe({
      next: (data) => {
        console.log(data)
      }, error: (error) => console.log('failed')
    })
  }

  async fetchDataByIdAndDateRange(id: string, startDate: Date, endDate: Date): Promise<any[]> {
    const files = await this.getFilesByDateRange(startDate, endDate);
    console.log('Files retrieved from date range:', files);

    const filteredFiles = files.filter(file => file.id === id);
    console.log('Filtered files by ID:', filteredFiles);

    const dataPromises = filteredFiles.map(async (file) => {
      const content = await this.getFile(file.path);
      const jsonData = JSON.parse(content);
      return jsonData.filter((item: { date: string }) => {
        const itemDate = new Date(item.date);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    });

    const data = await Promise.all(dataPromises);
    console.log('Data fetched by ID and date range:', data);

    // Flatten the array if needed
    return data.flat();
  }
}
