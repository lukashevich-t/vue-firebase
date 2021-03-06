import firebaseCredentials from "./firebaseCredentials";
import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword as createEmailUser,
  signInWithEmailAndPassword as signInWithEmail,
  signOut as so,
  onAuthStateChanged as oasc,
} from "firebase/auth";

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const app = initializeApp(firebaseCredentials);
const db = getFirestore(app);
const auth = getAuth(app);
const createUserWithEmailAndPassword = async (email, password) => {
  return createEmailUser(auth, email, password);
};

const signInWithEmailAndPassword = async (email, password) => {
  return signInWithEmail(auth, email, password);
};

function setSnapshotListener(
  collectionName,
  callback,
  orderField,
  order = "asc"
) {
  onSnapshot(
    query(collection(db, collectionName), orderBy(orderField, order)),
    callback
  );
}

async function orderedCollection(collectionName, orderField, order = "asc") {
  const coll = query(
    collection(db, collectionName),
    orderBy(orderField, order)
  );
  const snapshot = await getDocs(coll);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

async function getCollectionSnapshot(collectionName) {
  const coll = collection(db, collectionName);
  const snapshot = await getDocs(coll);
  return snapshot;
}

async function getCollection(collectionName) {
  let snapshot = await getCollectionSnapshot(collectionName);
  const docList = snapshot.docs.map((doc) => doc.data());
  return docList;
}

async function getCollectionWithIds(collectionName) {
  let snapshot = await getCollectionSnapshot(collectionName);
  const docList = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return docList;
}

async function getDocument(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

async function getDocumentWithId(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw Error("Doc doesn't exists");
  }
}

async function addDocument(collectionName, document) {
  const coll = collection(db, collectionName);
  await setDoc(doc(coll), document);
}

async function deleteDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

const signOut = async () => {
  return so(auth);
};

const onAuthStateChanged = (cb) => {
  return oasc(auth, cb);
};

const timestamp = serverTimestamp;

export {
  db,
  getCollection,
  getCollectionSnapshot,
  getCollectionWithIds,
  getDocument,
  getDocumentWithId,
  addDocument,
  deleteDocument,
  timestamp,
  orderedCollection,
  setSnapshotListener,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
