import { useState, useEffect } from "react"
import { SyncLoader } from "react-spinners"


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [removedCommentsCount, setRemovedCommentsCount] = useState(0)
  const [removedComments, setRemovedComments] = useState(false)

  useEffect(() => {
    chrome.action.setBadgeText({ text: removedCommentsCount.toString() })

  },[removedCommentsCount])

  const undoRemovingComments = async () => {
    setIsLoading(true)
    let [tab] = await chrome.tabs.query({active: true})
    chrome.scripting.executeScript<any, void>({
      target: {tabId: tab.id!}, func : () => {
        const comments = document.getElementsByTagName("ytd-comment-thread-renderer") as HTMLCollectionOf<HTMLElement>;
        for(let comment of comments){
          if(comment.style.display === "none"){
            comment.style.display = "block"
          }
        }
      }})
      setRemovedCommentsCount(0)
      setRemovedComments(false)
      setIsLoading(false)
  }

  chrome.runtime.onMessage.addListener((message) => {
    console.log(message)
    if(message.type == "removedCommentCountMessage"){
      setRemovedCommentsCount(message.count)
    }
  })


  return (
    <>
      <div className="min-w-64 p-3 flex flex-col items-center gap-3">
        <h1 className="font-bold">Youtube comments remover</h1>
        <button className="bg-blue-400 px-2 py-1 rounded-xl text-white ">Remove comments</button>
        
        {removedComments && <>
          <p>Removed {removedCommentsCount} comments</p>
          <button onClick={undoRemovingComments}>Undo removing</button>
          </>}
      </div>
      {isLoading &&
        <div className="w-screen h-screen flex items-center justify-center absolute top-0 left-0 bg-gray-300 bg-opacity-50">
          <SyncLoader color="#1d78ff"/>
        </div>}
    </>
  )
}

export default App
