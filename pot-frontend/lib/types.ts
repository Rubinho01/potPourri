export interface User { id: number; name: string; email?: string }
export interface Category { id: number; name: string }
export interface Piece { id: number; description: string; size: string; photoUrl: string; link: string | null; available: boolean; creatorId: number; categoryId: number; creator?: User; category?: Category; createdAt?: string }
export interface PostImage { id: number; url: string; order: number }
export interface Post { id: number; authorId: number; isActive: boolean; author?: User; images: PostImage[]; pieces: Piece[]; createdAt?: string }
export interface Session { user: User | null }
