/*
# Slack-Emoji-Scraper
Pulls emoji information from a slack instance

## Usage
Get Emoji Stats directly from your browser's developer tools with this script. Here's how:

1. Open up https://yourdomain.slack.com/customize/emoji in a browser window
2. Open up the developer console in your browser (genrally F12 but you can also use the menu)

### For Firefox
4. Click the "console" tab on the top of the tools bar
5. Paste in the code (you may need to type an allow message for Firefox to allow this, it will let you know)
6. Run the script by clicking on the run button in the top left corner of the dev tools window

### For Chrome
4. Go to the Sources Tab and the "Snippets" sub-tab (You may need to click the 3 dots next to Page or Filesystem to reveal)
5. Create New Snippet and paste this code into there (Optional: Right click on the snippet name and rename it to something cool!)
6. Run by right clicking on the Snippet name and selecting "Run"

### Save the output
7. This will output all the emoji to the console
8. Save output, formatting in bbedit or excel required
*/

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Get Token from webpages
var currentToken = boot_data.api_token;
console.log(currentToken);

var allEmoji ={};

function makeRequest(pageNum, pageSize) {
    //XHR Try
    var data = new FormData();
    data.append("token", currentToken);
    data.append("query", "");
    data.append("page", pageNum);
    data.append("count", pageSize);
    console.clear()
    console.log("\n")
    console.log("Emoji,Is_Alias,Alias_For,Author,Full_Date,Year,Month,Day,Time,URL")
    var request = new XMLHttpRequest();
    request.responseType ='json';
    request.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            for(let emojiItem of this.response.emoji){
                
                var d = new Date(emojiItem.created*1000);
                
                var month = '' + (d.getMonth() + 1);
                var day = '' + d.getDate();
                var year = d.getFullYear();
                var hour = d.getHours() + 1;
                var min = d.getMinutes() + 1;
                var sec = d.getSeconds() + 1;

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                console.log(":" + emojiItem.name + ":," + 
                            emojiItem.is_alias + "," + 
                            emojiItem.alias_for + ",\"" + 
                            emojiItem.user_display_name + "\"," +
                            [year, month, day].join('-') + "," + 
                            year + "," + 
                            month + "," + 
                            day + "," + 
                            [hour, min, sec].join(':') + "," +
                            emojiItem.url);
            }

            if (this.response.emoji.length == pageSize) {
                makeRequest(pageNum + 1, pageSize);
            }

        }
    }
    request.open("POST", '/api/emoji.adminList', true);
    request.setRequestHeader("cache-control", "no-cache");
    request.send(data);
}

makeRequest(1, 10000);
