import * as jspb from 'google-protobuf'



export class ListClassroomReq extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClassroomReq.AsObject;
  static toObject(includeInstance: boolean, msg: ListClassroomReq): ListClassroomReq.AsObject;
  static serializeBinaryToWriter(message: ListClassroomReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClassroomReq;
  static deserializeBinaryFromReader(message: ListClassroomReq, reader: jspb.BinaryReader): ListClassroomReq;
}

export namespace ListClassroomReq {
  export type AsObject = {
  }
}

export class ListClassroomRes extends jspb.Message {
  getOk(): ListClassroomRes.Data | undefined;
  setOk(value?: ListClassroomRes.Data): ListClassroomRes;
  hasOk(): boolean;
  clearOk(): ListClassroomRes;

  getErr(): Error | undefined;
  setErr(value?: Error): ListClassroomRes;
  hasErr(): boolean;
  clearErr(): ListClassroomRes;

  getResponseCase(): ListClassroomRes.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClassroomRes.AsObject;
  static toObject(includeInstance: boolean, msg: ListClassroomRes): ListClassroomRes.AsObject;
  static serializeBinaryToWriter(message: ListClassroomRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClassroomRes;
  static deserializeBinaryFromReader(message: ListClassroomRes, reader: jspb.BinaryReader): ListClassroomRes;
}

export namespace ListClassroomRes {
  export type AsObject = {
    ok?: ListClassroomRes.Data.AsObject,
    err?: Error.AsObject,
  }

  export class Data extends jspb.Message {
    getClassroomsList(): Array<ClassroomSummary>;
    setClassroomsList(value: Array<ClassroomSummary>): Data;
    clearClassroomsList(): Data;
    addClassrooms(value?: ClassroomSummary, index?: number): ClassroomSummary;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
  }

  export namespace Data {
    export type AsObject = {
      classroomsList: Array<ClassroomSummary.AsObject>,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    OK = 1,
    ERR = 2,
  }
}

export class ClassroomSummary extends jspb.Message {
  getId(): string;
  setId(value: string): ClassroomSummary;

  getName(): string;
  setName(value: string): ClassroomSummary;

  getStudentCount(): number;
  setStudentCount(value: number): ClassroomSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClassroomSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ClassroomSummary): ClassroomSummary.AsObject;
  static serializeBinaryToWriter(message: ClassroomSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClassroomSummary;
  static deserializeBinaryFromReader(message: ClassroomSummary, reader: jspb.BinaryReader): ClassroomSummary;
}

export namespace ClassroomSummary {
  export type AsObject = {
    id: string,
    name: string,
    studentCount: number,
  }
}

export class GetStudentsReq extends jspb.Message {
  getClassroomId(): string;
  setClassroomId(value: string): GetStudentsReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStudentsReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetStudentsReq): GetStudentsReq.AsObject;
  static serializeBinaryToWriter(message: GetStudentsReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStudentsReq;
  static deserializeBinaryFromReader(message: GetStudentsReq, reader: jspb.BinaryReader): GetStudentsReq;
}

export namespace GetStudentsReq {
  export type AsObject = {
    classroomId: string,
  }
}

export class GetStudentsRes extends jspb.Message {
  getOk(): GetStudentsRes.Data | undefined;
  setOk(value?: GetStudentsRes.Data): GetStudentsRes;
  hasOk(): boolean;
  clearOk(): GetStudentsRes;

  getErr(): Error | undefined;
  setErr(value?: Error): GetStudentsRes;
  hasErr(): boolean;
  clearErr(): GetStudentsRes;

  getResponseCase(): GetStudentsRes.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStudentsRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetStudentsRes): GetStudentsRes.AsObject;
  static serializeBinaryToWriter(message: GetStudentsRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStudentsRes;
  static deserializeBinaryFromReader(message: GetStudentsRes, reader: jspb.BinaryReader): GetStudentsRes;
}

export namespace GetStudentsRes {
  export type AsObject = {
    ok?: GetStudentsRes.Data.AsObject,
    err?: Error.AsObject,
  }

  export class Data extends jspb.Message {
    getClassroomId(): string;
    setClassroomId(value: string): Data;

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

