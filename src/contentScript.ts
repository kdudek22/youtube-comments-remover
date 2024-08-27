import { patterns } from "./pattenrs";

const regexPatterns: RegExp[] = patterns.map(p => RegExp(p, "i"))



function waitForElm(selector: string) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const checkIfCommentMatchesRegex = (comment: string): boolean => {
    for(let pattern of regexPatterns){
      if(pattern.test(comment)){
        return true
      }
    }
    return false
  }

const filterComments = () => {
    let removedCommentsCount: number = 0
    const comments = document.getElementsByTagName("ytd-comment-thread-renderer") as HTMLCollectionOf<HTMLElement>;

    for(let comment of comments){
      if(comment.style.display === "none") removedCommentsCount += 1

      const commentText: string = comment.getElementsByClassName("yt-core-attributed-string")[0].textContent!

      if(checkIfCommentMatchesRegex(commentText)){
          removedCommentsCount += 1
          comment.style.display = "none"
      }
    }
    console.log(removedCommentsCount)
    chrome.runtime.sendMessage({type: "removedCommentCountMessage", count: removedCommentsCount})
}



const performActions = async () => {
    const observer = new MutationObserver(() => {
        console.log("comments changed")
        filterComments()
    })

    filterComments()

    console.log("starting await")
    await waitForElm("ytd-comments")
    console.log("await finished")

     for(let element of document.getElementsByTagName("ytd-comments")){
        observer.observe(element, { childList: true, subtree: true })
     }



}

performActions()