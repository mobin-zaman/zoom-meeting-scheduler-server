// import generatePassword from 'generate-password';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async getUidFromFirebaseIdToken(firebaseIdToken: string): Promise<string> {
    const decodedIdToken = await this.firebase.auth.verifyIdToken(
      firebaseIdToken,
    );

    // console.log('decodedIdToken in firebase service: ', decodedIdToken);
    return decodedIdToken.uid;
  }

  async getUser(uid: string) {
    const user = await this.firebase.auth.getUser(uid);

    // console.log("Returned user: ", user);
    return user;
  }

  async createNewFirebaseUser(email: string, password: string) {
    const user = await this.firebase.auth.createUser({
      email: email,
      password: password,
    });

    return user;
  }

  async deleteFirebaseUser(uid: string) {
    await this.firebase.auth.deleteUser(uid);
  }

  //   async createNewUser(
  //     email: string,
  //   ): Promise<{ uid: string; password: string }> {
  //     //First check if an user exists with this email
  //     try {
  //       await this.firebase.auth.getUserByEmail(email);
  //     } catch (error) {
  //       console.log('Firebase service.createNewUser: ', error);
  //       throw error;
  //     }
  //     const password = generatePassword.generate({
  //       length: 10,
  //       numbers: true,
  //     });
  //     //else create the user and return the uid
  //     const user = await this.firebase.auth.createUser({
  //       email: email,
  //     });

  //     return {
  //       uid: user.uid,
  //       password: password,
  //     };
  //   }
}
