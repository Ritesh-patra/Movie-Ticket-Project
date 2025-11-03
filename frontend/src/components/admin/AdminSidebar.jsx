import React from 'react'
import { assets } from '../../assets/assets'
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/dashboard/add-shows', icon: PlusSquareIcon },
    { name: 'List Shows', path: '/dashboard/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/dashboard/list-bookings', icon: ListCollapseIcon },
  ]

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-12 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img
        className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
        src={user.imageUrl}
        alt="Admin"
      />
      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

      <div className="w-full">
        {adminNavlinks.map((link, index) => {
          const Icon = link.icon
          return (
            <NavLink
            end
              key={index}
              to={link.path}
              className={({ isActive }) =>
                `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6 transition-colors ${
                  isActive ? 'bg-[#FD5965]/15 text-white' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  <p className="max-md:hidden">{link.name}</p>
                  <span
                    className={`w-1.5 h-10 rounded-l right-0 absolute ${
                      isActive ? 'bg-[#FD5965]' : ''
                    }`}
                  />
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default AdminSidebar
