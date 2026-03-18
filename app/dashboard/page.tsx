'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) redirect('/login');

  const role = session.user?.role;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" alt="Projextion Logo" width={25} height={25} style={{ display: 'block', objectFit: 'contain', transform: 'scale(2.2)' }} />
        <h1 className="text-3xl font-bold text-gray-800">Projextion Dashboard - {role}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === 'Admin' && <AdminDashboard />}
        {role === 'Faculty' && <FacultyDashboard />}
        {role === 'Student' && <StudentDashboard />}
      </div>
      <ProfileSection />
    </div>
  );
}

// Enhanced components with links
function AdminDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
      <ul className="space-y-2">
        <li><Link href="/admin/project-types" className="text-blue-500 hover:underline">Manage Project Types</Link></li>
        <li><Link href="/admin/staff" className="text-blue-500 hover:underline">Manage Staff</Link></li>
        <li><Link href="/reports/projects" className="text-blue-500 hover:underline">View Reports</Link></li>
      </ul>
    </div>
  );
}

function FacultyDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Faculty Overview</h2>
      <p>View your assigned groups and schedule meetings.</p>
      <Link href="/groups/my" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded">My Groups</Link>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
      <p>Your groups, meetings, and tasks.</p>
      <Link href="/groups/create" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Create Group</Link>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="md:col-span-3 mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {/* Add form here later */}
      <p>Update your name, phone, email.</p>
    </div>
  );
}