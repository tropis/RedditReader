Meteor.publish('subredditSearch', function(subreddit) {
    var self = this;

    try {
        var response = HTTP.get('http://reddit.com/r/' + subreddit + '.json');

        _.each(response.data.data.children, function(item) {
            var data = item.data;
            
            /*
            console.log(data.id);
            console.log(data.isUrl);
            console.log(data);
            */
            
            var len = 200;

            var post = {
                id: data.id,
                url: data.url,
                domain: data.domain,
                comment_count: data.num_comments,
                permalink: data.permalink,
                title: data.title,
                selftext: '',
                thumbnail: false
            };

            post.comment_s = post.comment_count == 1 ? "" : "s";


            /* selftext is not used
            if (typeof data.selftext == 'undefined'){
                console.log("selftext is undefined");
            }
            else{            
                if (data.selftext != "") {
                    post.selftext = data.selftext.substr(0, len)
                }
            }
            */

            if (data.thumbnail != "self" && 
                Meteor.call('isUrl', data.thumbnail)) {
                post.thumbnail = data.thumbnail
            }

            self.added('posts', Random.id(), post);
        });

        self.ready();
    } catch (error) {
        console.log(error);
    }
});

Meteor.methods({ 
    isUrl: function(url) {
        if (url.indexOf('http') > -1) { return true; }
        return false;
    }
});