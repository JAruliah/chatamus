import React from 'react'

interface UserProps {
    userName:string
}

export const ActiveUser: React.FC<UserProps> = ({userName}) => {
        return (
            <div>
                <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 -1028.4)"><path d="m8.4062 1041.1c-2.8856 1.3-4.9781 4-5.3437 7.3 0 1.1 0.8329 2 1.9375 2h14c1.105 0 1.938-0.9 1.938-2-0.366-3.3-2.459-6-5.344-7.3-0.649 1.3-2.011 2.3-3.594 2.3s-2.9453-1-3.5938-2.3z" fill="#2c3e50"/><path d="m17 4a5 5 0 1 1 -10 0 5 5 0 1 1 10 0z" fill="#34495e" transform="translate(0 1031.4)"/><path d="m12 11c-1.277 0-2.4943 0.269-3.5938 0.75-2.8856 1.262-4.9781 3.997-5.3437 7.25 0 1.105 0.8329 2 1.9375 2h14c1.105 0 1.938-0.895 1.938-2-0.366-3.253-2.459-5.988-5.344-7.25-1.1-0.481-2.317-0.75-3.594-0.75z" fill="#34495e" transform="translate(0 1028.4)"/></g></svg>
                <p>{userName}</p>
            </div>
        );
}