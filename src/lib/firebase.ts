import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import { RetailProduct, RentalService, EventPackage, CustomerReview } from '../types';
import firebaseConfigJson from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId
};

const app = initializeApp(firebaseConfig);
const databaseId = firebaseConfigJson.firestoreDatabaseId || "(default)";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'technocore_state', 'connection_test'));
    console.log("Firestore client connected successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export const syncCollection = async <T extends { id: string }>(collectionName: string, items: T[]) => {
  try {
    const batch = writeBatch(db);
    items.forEach(item => {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, item);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
};

export const fetchCollection = async <T>(collectionName: string): Promise<T[]> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(doc => doc.data() as T);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionName);
    return [];
  }
};

export const addDocument = async <T extends { id: string }>(collectionName: string, item: T) => {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionName);
  }
};

export const updateDocument = async <T extends { id: string }>(collectionName: string, item: T) => {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, collectionName);
  }
};

export const removeDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
};

export const firebaseHelpers = {
  // Retail Products
  getRetailProducts: () => fetchCollection<RetailProduct>('retailProducts'),
  syncRetailProducts: (items: RetailProduct[]) => syncCollection('retailProducts', items),
  
  // Rental Services
  getRentalServices: () => fetchCollection<RentalService>('rentalServices'),
  syncRentalServices: (items: RentalService[]) => syncCollection('rentalServices', items),
  
  // Event Packages
  getEventPackages: () => fetchCollection<EventPackage>('eventPackages'),
  syncEventPackages: (items: EventPackage[]) => syncCollection('eventPackages', items),
};

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'ret-1',
    productName: 'QSC K12.2 Powered Loudspeakers',
    customerName: 'Marco S. (Davao Events Co.)',
    rating: 5,
    testimonial: 'Techno Core provided exceptional audio clarity for our 500-guest outdoor corporate gala in Matina Enclaves. Pristine punch and seamless delivery!',
    createdAt: '2026-06-15T10:00:00.000Z'
  },
  {
    id: 'rev-2',
    productId: 'pkg-2',
    productName: 'Pro Concert Audio & Lighting Package',
    customerName: 'Aria V. (Samal Island Wedding Planner)',
    rating: 5,
    testimonial: 'The mega aircon tent and 45 kVA generator setup for our beachfront wedding in Samal was flawless. Highly professional team and top-tier gear!',
    createdAt: '2026-07-02T14:30:00.000Z'
  },
  {
    id: 'rev-3',
    productId: 'ret-2',
    productName: 'Shure SLXD24/SM58 Wireless System',
    customerName: 'DJ Kenneth (A3 Music Club Davao)',
    rating: 5,
    testimonial: 'Zero RF drops and crystal-clear high frequencies throughout our 6-hour music festival set at Crocodile Park. Techno Core is our go-to in Davao.',
    createdAt: '2026-07-20T09:15:00.000Z'
  }
];

export const reviewsHelpers = {
  getReviews: async () => {
    try {
      const items = await fetchCollection<CustomerReview>('customerReviews');
      if (items && items.length > 0) return items;
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  },
  addReview: (review: CustomerReview) => addDocument('customerReviews', review),
  syncReviews: (items: CustomerReview[]) => syncCollection('customerReviews', items),
};


