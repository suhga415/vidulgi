const axios = require("axios");
const moment = require("moment");

const commentForm = document.querySelector("#jsAddComment");
let username;
let userAvatarUrl;
const ul = document.querySelector("#jsCommentsList");
const commentNumber = document.querySelector("#jsCommentNumber");


function incrementCommentNumber() {
    const numComments = parseInt(commentNumber.innerText.split(" comment")[0]);
    if (numComments === 0) {
        commentNumber.innerText = "1 comment";
    } else {
        commentNumber.innerText = `${numComments + 1} comments`;
    }
}

function addFakeComment(commentId, commentBody) {
    const li = document.createElement("li");
    const speechBubble = document.createElement("div");
    const img = document.createElement("img");
    const speechBubbleColumn = document.createElement("div");
    const speechBubbleRow = document.createElement("div");
    const userName = document.createElement("span");
    const spanDot = document.createElement("span");
    const spanDate = document.createElement("span");
    const spanText = document.createElement("span");
    const delBtn = document.createElement("button");
    
    speechBubble.setAttribute("class", "speech-bubble");
    speechBubbleColumn.setAttribute("class", "speech-bubble__column");
    speechBubbleRow.setAttribute("class", "speech-bubble__row");

    delBtn.setAttribute("class", "comment__delBtn");
    delBtn.setAttribute("id", "jsDeleteCommentBtn");
    delBtn.setAttribute("value", commentId); 
    delBtn.innerText = "Delete"; // 이 삭제 버튼은 완전 훼이크인데... 

    userName.innerText = username;
    spanDot.innerText = " • ";// `${username}: ${commentBody}`;
    spanDot.setAttribute("class", "dot");
    spanDate.innerText = moment(new Date()).format('YYYY. MM. DD.');
    spanDate.setAttribute("class", "comment__date");
    spanText.innerText = commentBody;

    img.setAttribute("class", "u-avatar__small");
    img.setAttribute("src", userAvatarUrl);

    speechBubbleRow.appendChild(userName);
    speechBubbleRow.appendChild(spanDot);
    speechBubbleRow.appendChild(spanDate);
    speechBubbleRow.appendChild(delBtn);

    speechBubbleColumn.appendChild(speechBubbleRow);
    speechBubbleColumn.appendChild(spanText);

    speechBubble.appendChild(img);
    speechBubble.appendChild(speechBubbleColumn);

    li.appendChild(speechBubble);
    ul.prepend(li); // put on the top!
    incrementCommentNumber();
}

async function handleSubmit(event) {
    event.preventDefault();
    const videoId = window.location.href.split("/videos/")[1];
    const commentInput = document.querySelector("#jsComment")
    const commentBody = commentInput.value;
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment: commentBody
        }
    });
    const commentId = response.data;
    commentInput.value = "";
    if (response.status === 200) {
        addFakeComment(commentId, commentBody);
    }
}


function init() {
    if(commentForm) {
        username = document.querySelector("#jsUsername").innerText;
        userAvatarUrl = document.querySelector("#jsUserAvatarUrl").src;
        commentForm.addEventListener("submit", handleSubmit);
    }
}

init();