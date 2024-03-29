import React, {useState} from 'react'
import {Message} from '../interfaces'
import { ChatMessage } from './ChatMessage'
import { ActiveUser } from './ActiveUser'
import {User} from '../interfaces'
import { Socket } from 'socket.io-client'
import ReactScrollableFeed from 'react-scrollable-feed'

// Interface for props
export interface ChatProps {
    userName: string,
    room: string,
    socket:Socket,
    setRoomUsers:React.Dispatch<React.SetStateAction<User[]>>
    roomUsers:User[]
}

export const Chat: React.FC<ChatProps> = ({userName, room, socket, roomUsers, setRoomUsers}) => {
    const [currentMessage, setCurrentMessage] = useState<string>("")
    const [messageList, setMessageList] = useState<Message[]>([]) 

    // when sending a message emit the message data to the server and add message to message list
    const sendMessage = async () => {
        let time:string
        let hours = new Date(Date.now()).getHours() 
        let minutes:number  =new Date(Date.now()).getMinutes()
        let minuteString:string =""
        if (minutes<10){
            minuteString = `0${minutes}`
        }
        else{
            minuteString=`${minutes}`
        }

        if (hours < 12){
            time = new Date(Date.now()).getHours() % 12  + ":" + minuteString + "am"
        }
        if (new Date(Date.now()).getHours() === 12){
            time = "12:"+ minuteString + "pm"
        }

        if (hours === 12){
            time = `${12}:${minuteString}pm`
        }
        else{
            time = new Date(Date.now()).getHours() % 12  + ":" + minuteString+ "pm"
        }

        if (currentMessage !== ""){
            const messageData : Message= {
                room:room,
                author: userName,
                message: currentMessage,
                time: time
            }
            await socket.emit("send-message", messageData)
            // Set the author to 'You' when the author is the user 
            if (messageData.author === userName){
                messageData.author = "You"
            }
            setMessageList([...messageList, messageData])
            setCurrentMessage("")
        }
    }

    const enterSubmit = (e:any) =>{
        if (e.code === "Enter"){
            e.preventDefault()
            e.stopPropagation()
            sendMessage()
        }
    }

    // when recieve-message event add the message data to the message list
    socket.on("receive-message", (messageData:Message) :void =>{
        setMessageList([...messageList, messageData])
        })

    // when a user joins the chat room, display conencted message to the room
    socket.on('user-join', (joinedUser:{userName:string}) =>{
        let minutes:number  =new Date(Date.now()).getMinutes()
        let minuteString:string =""
        let time :string
        if (minutes<10){
            minuteString = `0${minutes}`
        }
        else{
            minuteString=`${minutes}`
        }
        let hours = new Date(Date.now()).getHours()
        if (hours > 12){
            time = new Date(Date.now()).getHours() % 12 + ":"+minuteString + "pm"
        }
        if (hours === 12){
            time = `${12}:${minuteString}pm`
        }        
        else{
            time = new Date(Date.now()).getHours() % 12 + ":"+minuteString + "am"
        }
        const messageData : Message= {
            author: joinedUser.userName,
            message: "connected",
            time: time
        }
        // set use to 'You' if the username is equal to the user's username
        if (messageData.author === userName){
            messageData.author = "You"
        }
        setMessageList([...messageList, messageData])
    })

    // When a user disconnects recieve the user's info and update the room list
    socket.on('user-left', (disconnectedUser:User[]) =>{
        const newUserList = roomUsers.filter(user => user.id !== disconnectedUser[0].id)
        let time:string
        let hours:number = new Date(Date.now()).getHours() 
        let minutes:number  = new Date(Date.now()).getMinutes()
        let minuteString:string =""
        if (minutes<10){
            minuteString = `0${minutes}`
        }
        else{
            minuteString=`${minutes}`
        }
        if (hours > 12){
            time = `${hours % 12}:${minuteString}pm`
        }
        if (hours === 12){
            time = `${12}:${minuteString}pm`
        }
        else{
            time = `${hours % 12}:${minuteString}am`
        }
        
        const messageData : Message = {author:disconnectedUser[0].userName,message:"disconnected", time:time}
        setMessageList([...messageList, messageData ])
        setRoomUsers(newUserList)
    })

    

        return (
            <div className="chat">
                              <img src="/img/send.png" width="50" height="50" className="mx-auto mb-3" alt="logo"/>
                <h1 className="text-center text-3xl">Hello, {userName}</h1>
                <div className="active-users">
                    <h2 className="text-center text-xl">{room}: Active Users</h2>
                    <div className="user">
                        {roomUsers.map((item, index)=>{return <ActiveUser key={index} userName={item.userName}/>})}
                    </div>
                </div>
                <form onSubmit={sendMessage}>
                    <div className="chat-header">
                    </div>
                    <div className="chat-body" id="chat-body">
                        <ReactScrollableFeed>
                            {messageList.map((message, index) => { return <ChatMessage key={index} messageData={message}/> })}
                        </ReactScrollableFeed>
                    </div>
                    <div className="chat-footer">
                        <textarea onKeyPress={(e) => enterSubmit(e)} value={currentMessage} maxLength={150} onChange={(e) => {setCurrentMessage(e.target.value)}}/>
                        <button type="button" onClick={()=>sendMessage()}>Send</button>
                    </div>
                </form>
                <div className="leave">
                    <button type="button" onClick={(e) => {window.location.reload()}}>Leave</button>
                </div>
            </div>
        );
}