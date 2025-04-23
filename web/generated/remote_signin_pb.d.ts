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

export class GetDetailsReq extends jspb.Message {
  getClassroomId(): string;
  setClassroomId(value: string): GetDetailsReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDetailsReq.AsObject;
  static toObject(includeInstance: boolean, msg: GetDetailsReq): GetDetailsReq.AsObject;
  static serializeBinaryToWriter(message: GetDetailsReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDetailsReq;
  static deserializeBinaryFromReader(message: GetDetailsReq, reader: jspb.BinaryReader): GetDetailsReq;
}

export namespace GetDetailsReq {
  export type AsObject = {
    classroomId: string,
  }
}

export class GetDetailsRes extends jspb.Message {
  getOk(): GetDetailsRes.Data | undefined;
  setOk(value?: GetDetailsRes.Data): GetDetailsRes;
  hasOk(): boolean;
  clearOk(): GetDetailsRes;

  getErr(): Error | undefined;
  setErr(value?: Error): GetDetailsRes;
  hasErr(): boolean;
  clearErr(): GetDetailsRes;

  getResponseCase(): GetDetailsRes.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDetailsRes.AsObject;
  static toObject(includeInstance: boolean, msg: GetDetailsRes): GetDetailsRes.AsObject;
  static serializeBinaryToWriter(message: GetDetailsRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDetailsRes;
  static deserializeBinaryFromReader(message: GetDetailsRes, reader: jspb.BinaryReader): GetDetailsRes;
}

export namespace GetDetailsRes {
  export type AsObject = {
    ok?: GetDetailsRes.Data.AsObject,
    err?: Error.AsObject,
  }

  export class Data extends jspb.Message {
    getInfo(): ClassroomSummary | undefined;
    setInfo(value?: ClassroomSummary): Data;
    hasInfo(): boolean;
    clearInfo(): Data;

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
      info?: ClassroomSummary.AsObject,
      studentsList: Array<Student.AsObject>,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    OK = 1,
    ERR = 2,
  }
}

export class UpdateStudentReq extends jspb.Message {
  getStudent(): Student | undefined;
  setStudent(value?: Student): UpdateStudentReq;
  hasStudent(): boolean;
  clearStudent(): UpdateStudentReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStudentReq.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStudentReq): UpdateStudentReq.AsObject;
  static serializeBinaryToWriter(message: UpdateStudentReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStudentReq;
  static deserializeBinaryFromReader(message: UpdateStudentReq, reader: jspb.BinaryReader): UpdateStudentReq;
}

export namespace UpdateStudentReq {
  export type AsObject = {
    student?: Student.AsObject,
  }
}

export class UpdateStudentRes extends jspb.Message {
  getOk(): UpdateStudentRes.Data | undefined;
  setOk(value?: UpdateStudentRes.Data): UpdateStudentRes;
  hasOk(): boolean;
  clearOk(): UpdateStudentRes;

  getErr(): Error | undefined;
  setErr(value?: Error): UpdateStudentRes;
  hasErr(): boolean;
  clearErr(): UpdateStudentRes;

  getResponseCase(): UpdateStudentRes.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateStudentRes.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateStudentRes): UpdateStudentRes.AsObject;
  static serializeBinaryToWriter(message: UpdateStudentRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateStudentRes;
  static deserializeBinaryFromReader(message: UpdateStudentRes, reader: jspb.BinaryReader): UpdateStudentRes;
}

export namespace UpdateStudentRes {
  export type AsObject = {
    ok?: UpdateStudentRes.Data.AsObject,
    err?: Error.AsObject,
  }

  export class Data extends jspb.Message {
    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Data.AsObject;
    static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
    static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Data;
    static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
  }

  export namespace Data {
    export type AsObject = {
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

