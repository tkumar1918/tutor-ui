import type {
  Expertise,
  Pageable,
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
  },
  tutorApplications: {
    all: ['tutor-applications'] as const,
    list: (params: { status?: TutorApplicationStatus; pageable: Pageable }) =>
      [...qk.tutorApplications.all, 'list', params] as const,
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
  reviews: {
    all: ['reviews'] as const,
    forTutor: (tutorId: number, pageable: Pageable) =>
      [...qk.reviews.all, 'tutor', tutorId, pageable] as const,
  },
}
