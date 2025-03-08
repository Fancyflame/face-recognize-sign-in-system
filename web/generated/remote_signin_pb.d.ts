import * as jspb from 'google-protobuf'



export class ClassroomReq extends jspb.Message {
  getClassroomId(): string;
  setClassroomId(value: string): ClassroomReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClassroomReq.AsObject;
  static toObject(includeInstance: boolean, msg: ClassroomReq): ClassroomReq.AsObject;
  static serializeBinaryToWriter(message: ClassroomReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClassroomReq;
  static deserializeBinaryFromReader(message: ClassroomReq, reader: jspb.BinaryReader): ClassroomReq;
}

export namespace ClassroomReq {
  export type AsObject = {
    classroomId: string,
  }
}

export class ClassroomRes extends jspb.Message {
  getOk(): ClassroomRes.Data | undefined;
  setOk(value?: ClassroomRes.Data): ClassroomRes;
  hasOk(): boolean;
  clearOk(): ClassroomRes;

  getErr(): Error | undefined;
  setErr(value?: Error): ClassroomRes;
  hasErr(): boolean;
  clearErr(): ClassroomRes;

  getResponseCase(): ClassroomRes.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClassroomRes.AsObject;
  static toObject(includeInstance: boolean, msg: ClassroomRes): ClassroomRes.AsObject;
  static serializeBinaryToWriter(message: ClassroomRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClassroomRes;
  static deserializeBinaryFromReader(message: ClassroomRes, reader: jspb.BinaryReader): ClassroomRes;
}

export namespace ClassroomRes {
  export type AsObject = {
    ok?: ClassroomRes.Data.AsObject,
    err?: Error.AsObject,
  }

  export class Data extends jspb.Message {
    getClassroomId(): string;
    setClassroomId(value: string): Data;

    getName(): string;
    setName(value: string): Data;

    getStudentsList(): Array<Student>;
    setStudentsList(value: Array<Student>): Data;
    clearStudentsList(): Data;
    addStudents(value?: Student, index?: number): Student;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
  }

  export namespace Data {
    export type AsObject = {
      classroomId: string,
      name: string,
      studentsList: Array<Student.AsObject>,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    OK = 1,
    ERR = 2,
  }
}

export class Student extends jspb.Message {
  getId(): string;
  setId(value: string): Student;

  getName(): string;
  setName(value: string): Student;

  getFaceDescriptorList(): Array<number>;
  setFaceDescriptorList(value: Array<number>): Student;
  clearFaceDescriptorList(): Student;
  addFaceDescriptor(value: number, index?: number): Student;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Student.AsObject;
  static toObject(includeInstance: boolean, msg: Student): Student.AsObject;
  static serializeBinaryToWriter(message: Student, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Student;
  static deserializeBinaryFromReader(message: Student, reader: jspb.BinaryReader): Student;
}

export namespace Student {
  export type AsObject = {
    id: string,
    name: string,
    faceDescriptorList: Array<number>,
  }
}

export class Error extends jspb.Message {
  getErrMsg(): string;
  setErrMsg(value: string): Error;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    errMsg: string,
  }
}

