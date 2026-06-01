import type {
  EnrollmentStatus,
  Expertise,
  Level,
  Pageable,
  Subject,
  TutorApplicationStatus,
  TutoringRequestStatus,
} from '@/types/api'

export const qk = {
  me: {
    all: ['me'] as const,
    profile: () => [...qk.me.all, 'profile'] as const,
    notifications: () => [...qk.me.all, 'notifications'] as const,
  },
  tutors: {
    all: ['tutors'] as const,
    list: (params: { expertise?: Expertise; search?: string; pageable: Pageable }) =>
      [...qk.tutors.all, 'list', params] as const,
    detail: (id: number) => [...qk.tutors.all, 'detail', id] as const,
    courses: (id: number, pageable: Pageable) =>
      [...qk.tutors.all, id, 'courses', pageable] as const,
  },
  tutorApplications: {
    all: ['tutor-applications'] as const,
    list: (params: { status?: TutorApplicationStatus; pageable: Pageable }) =>
      [...qk.tutorApplications.all, 'list', params] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (params: {
      tutorId?: number
      subject?: Subject
      level?: Level
      search?: string
      pageable: Pageable
    }) => [...qk.courses.all, 'list', params] as const,
    mine: (pageable: Pageable) => [...qk.courses.all, 'mine', pageable] as const,
    detail: (id: number) => [...qk.courses.all, 'detail', id] as const,
    enrollments: (id: number, params: { status?: EnrollmentStatus; pageable: Pageable }) =>
      [...qk.courses.all, id, 'enrollments', params] as const,
  },
  enrollments: {
    all: ['enrollments'] as const,
    list: (params: {
      userId?: number
      courseId?: number
      status?: EnrollmentStatus
      pageable: Pageable
    }) => [...qk.enrollments.all, 'list', params] as const,
    mine: (params: { status?: EnrollmentStatus; pageable: Pageable }) =>
      [...qk.enrollments.all, 'mine', params] as const,
    detail: (id: number) => [...qk.enrollments.all, 'detail', id] as const,
  },
  tutoringRequests: {
    all: ['tutoring-requests'] as const,
    mine: (params: { status?: TutoringRequestStatus; pageable: Pageable }) =>
      [...qk.tutoringRequests.all, 'mine', params] as const,
    incoming: (params: { status?: TutoringRequestStatus; pageable: Pageable }) =>
      [...qk.tutoringRequests.all, 'incoming', params] as const,
    adminList: (params: {
      studentId?: number
      tutorId?: number
      status?: TutoringRequestStatus
      pageable: Pageable
    }) => [...qk.tutoringRequests.all, 'admin', params] as const,
    detail: (id: number) => [...qk.tutoringRequests.all, 'detail', id] as const,
  },
}
