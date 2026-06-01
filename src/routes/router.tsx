import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { RequireAdmin, RequireAuth, RequireTutor } from './guards'
import { paths } from './paths'
import { NotFoundPage } from '@/components/common/not-found-page'

import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

import { CoursesListPage } from '@/features/courses/pages/CoursesListPage'
import { CourseDetailPage } from '@/features/courses/pages/CourseDetailPage'
import { CourseNewPage } from '@/features/courses/pages/CourseNewPage'
import { CourseEditPage } from '@/features/courses/pages/CourseEditPage'
import { MyCoursesPage } from '@/features/courses/pages/MyCoursesPage'

import { TutorsListPage } from '@/features/tutors/pages/TutorsListPage'
import { TutorDetailPage } from '@/features/tutors/pages/TutorDetailPage'
import { TutorProfileEditPage } from '@/features/tutors/pages/TutorProfileEditPage'

import { MePage } from '@/features/me/pages/MePage'
import { MeEditPage } from '@/features/me/pages/MeEditPage'
import { ApplyTutorPage } from '@/features/me/pages/ApplyTutorPage'

import { EnrollmentsListPage } from '@/features/enrollments/pages/EnrollmentsListPage'
import { EnrollmentDetailPage } from '@/features/enrollments/pages/EnrollmentDetailPage'
import { MyEnrollmentsPage } from '@/features/enrollments/pages/MyEnrollmentsPage'

import { ApplicationsListPage } from '@/features/tutor-applications/pages/ApplicationsListPage'

import { MyRequestsPage } from '@/features/tutoring-requests/pages/MyRequestsPage'
import { TutorInboxPage } from '@/features/tutoring-requests/pages/TutorInboxPage'
import { AdminRequestsPage } from '@/features/tutoring-requests/pages/AdminRequestsPage'

import { AdminSectionRedirect, MySectionRedirect } from './section-redirects'

export const router = createBrowserRouter([
  { path: paths.login, element: <LoginPage /> },
  { path: paths.register, element: <RegisterPage /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to={paths.courses} replace /> },

      { path: paths.courses, element: <CoursesListPage /> },
      { path: paths.courseDetail(':id'), element: <CourseDetailPage /> },
      { path: paths.tutors, element: <TutorsListPage /> },
      { path: paths.tutorDetail(':id'), element: <TutorDetailPage /> },

      {
        element: <RequireAuth />,
        children: [
          { path: paths.mySection, element: <MySectionRedirect /> },
          { path: paths.me, element: <MePage /> },
          { path: paths.meEdit, element: <MeEditPage /> },
          { path: paths.applyTutor, element: <ApplyTutorPage /> },
          { path: paths.myEnrollments, element: <MyEnrollmentsPage /> },
          { path: paths.enrollmentDetail(':id'), element: <EnrollmentDetailPage /> },
          { path: paths.myRequests, element: <MyRequestsPage /> },
        ],
      },

      {
        element: <RequireTutor />,
        children: [
          { path: paths.courseNew, element: <CourseNewPage /> },
          { path: paths.courseEdit(':id'), element: <CourseEditPage /> },
          { path: paths.myCourses, element: <MyCoursesPage /> },
          { path: paths.tutorEditMe, element: <TutorProfileEditPage /> },
          { path: paths.tutorInbox, element: <TutorInboxPage /> },
        ],
      },

      {
        element: <RequireAdmin />,
        children: [
          { path: paths.adminSection, element: <AdminSectionRedirect /> },
          { path: paths.enrollments, element: <EnrollmentsListPage /> },
          { path: paths.adminApplications, element: <ApplicationsListPage /> },
          { path: paths.adminRequests, element: <AdminRequestsPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
