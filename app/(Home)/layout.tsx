import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const layout = async ({children}: {children:React.ReactNode}) => {
      const user = await currentUser();
      // Removed: if(!user) return null;

      if(user){
        const loggedInUser = await prisma.user.findUnique({
           where:{
              clerkUserId:user.id
           },
        });
        if(!loggedInUser){
            await prisma.user.create({
              data:{
                  name: (user.firstName && user.lastName)
                    ? `${user.firstName} ${user.lastName}`
                    : (user.username || user.emailAddresses[0].emailAddress),
                  clerkUserId: user.id,
                  email: user.emailAddresses[0].emailAddress,
                  imageUrl: user.imageUrl,
              },
            });
        }
      }
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
