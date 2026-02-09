export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface UserDoc {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: FirebaseFirestore.Timestamp;
}
