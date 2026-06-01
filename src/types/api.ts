export const EXPERTISE = ['MATH', 'SCIENCE', 'PROGRAMMING', 'LANGUAGES', 'MUSIC', 'ART', 'OTHER'] as const
export type Expertise = (typeof EXPERTISE)[number]

export const SUBJECT = ['MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'COMPUTER_SCIENCE', 'ENGLISH', 'HISTORY', 'OTHER'] as const
export type Subject = (typeof SUBJECT)[number]

export const LEVEL = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export type Level = (typeof LEVEL)[number]

export const ENROLLMENT_STATUS = ['ACTIVE', 'COMPLETED', 'CANCELLED'] as const
export type EnrollmentStatus = (typeof ENROLLMENT_STATUS)[number]

export const TUTOR_APPLICATION_STATUS = ['PENDING', 'APPROVED', 'REJECTED'] as const
export type TutorApplicationStatus = (typeof TUTOR_APPLICATION_STATUS)[number]

export const TUTORING_REQUEST_STATUS = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'] as const
export type TutoringRequestStatus = (typeof TUTORING_REQUEST_STATUS)[number]

export const ROLE_TUTOR = 'ROLE_TUTOR'
export const ROLE_ADMIN = 'ROLE_ADMIN'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface Pageable {
  page: number
  size: number
  sort?: string[]
}

export interface AuthResponse {
  token: string
  tokenType: string
  username: string
  authorities: string[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth?: string
}

export interface UserResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  admin: boolean
  createdAt: string
  updatedAt: string
}

export interface UserUpdateRequest {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
}

export interface CurrentUserResponse {
  user: UserResponse
  authorities: string[]
  tutorProfile?: TutorProfileResponse
}

export interface TutorProfileResponse {
  id: number
  userId: number
  firstName: string
  lastName: string
  bio?: string
  expertise: Expertise
  qualifications?: string
  yearsOfExperience: number
  hourlyRateCents: number
  status: TutorApplicationStatus
  appliedAt: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface TutorApplicationRequest {
  bio?: string
  expertise: Expertise
  qualifications?: string
  yearsOfExperience: number
  hourlyRateCents: number
}

export interface TutorUpdateRequest {
  bio?: string
  expertise?: Expertise
  qualifications?: string
  yearsOfExperience?: number
  hourlyRateCents?: number
}

export const AUTH_ERROR_CODES = [
  'INVALID_CREDENTIALS',
  'TOKEN_EXPIRED',
  'TOKEN_VERSION_MISMATCH',
  'MISSING_TOKEN',
  'INVALID_TOKEN',
  'FORBIDDEN',
] as const
export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number]

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  code?: AuthErrorCode
  message: string
  path: string
  fieldErrors?: Array<{ field: string; message: string; rejectedValue: unknown }>
}

export interface TutorApplicationReviewRequest {
  status: TutorApplicationStatus
  rejectionReason?: string
}

export interface CourseResponse {
  id: number
  title: string
  description?: string
  subject: Subject
  level: Level
  priceCents: number
  tutorId: number
  tutorName: string
  createdAt: string
  updatedAt: string
}

export interface CourseCreateRequest {
  title: string
  description?: string
  subject: Subject
  level: Level
  priceCents: number
}

export interface CourseUpdateRequest {
  title?: string
  description?: string
  subject?: Subject
  level?: Level
  priceCents?: number
}

export interface EnrollmentResponse {
  id: number
  userId: number
  userName: string
  courseId: number
  courseTitle: string
  enrolledAt: string
  status: EnrollmentStatus
}

export interface EnrollmentCreateRequest {
  courseId: number
}

export interface EnrollmentStatusUpdateRequest {
  status: EnrollmentStatus
}

export interface TutoringRequestResponse {
  id: number
  studentId: number
  studentName: string
  tutorId: number
  tutorName: string
  subject: Subject
  message: string
  status: TutoringRequestStatus
  tutorReply?: string
  createdAt: string
  respondedAt?: string
}

export interface TutoringRequestCreateRequest {
  tutorId: number
  subject: Subject
  message: string
}

export interface TutoringRequestRespondRequest {
  status: TutoringRequestStatus
  tutorReply?: string
}

export interface NotificationCountsResponse {
  tutorPendingRequests: number
  adminPendingApplications: number
}
