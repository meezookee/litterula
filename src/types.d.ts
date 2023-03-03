declare interface FileSystemDirectoryHandle {
  keys(): AsyncIterable<string>;
  values(): AsyncIterable<FileSystemFileHandle>;
}

declare interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

declare interface FileSystemWritableFileStream extends WritableStream {
  write(data: string): Promise<undefined>;
}
