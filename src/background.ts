chrome.runtime.onMessage.addListener((message) => {
    console.log(message)
    if(message.type == "removedCommentCountMessage"){
        chrome.action.setBadgeText({ text: message.count.toString() })
    }
  })