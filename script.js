// script.js
document.getElementById('generateBtn').addEventListener('click', function () {
    console.log("Click 1");
    const randomData = generateRandomData();
    console.log("Click 2");
    document.getElementById('randomData').textContent = randomData;
    console.log("Click 3");
});

function generateRandomData() {
    // script.js
    const data = {
        "Bible": [
            {
                "Activity": "Listen to an audio recording",
                "Description": "Listen to an audio recording of the weekly Bible reading, or take turns reading it aloud. Each family member could read the words of a different Bible character."
            },
            {
                "Activity": "Prepare questions",
                "Description": "Prepare questions based on the weekly Bible reading. Have family members choose one question each and research it. Then they can share what they have learned."
            },
            {
                "Activity": "Research Bible principles",
                "Description": "Pose a question or describe a situation, and then research the Bible principles in Scriptures for Christian Living that apply."
            },
            {
                "Activity": "Reenact a Bible account",
                "Description": "Reenact a portion of a Bible account."
            },
            {
                "Activity": "Memorize Bible verses",
                "Description": "Prepare a flash card with a different Bible verse each week, such as those from appendix A in the brochure Love People​—Make Disciples, and try to memorize it."
            },
            {
                "Activity": "Study a book",
                "Description": "Study a portion of the Enjoy Life Forever! book."
            },
            {
                "Activity": "Present a report",
                "Description": "Assign family members to present a report on one of the articles from the series 'Bible Questions Answered' or 'Bible Verses Explained' on jw.org."
            }
        ],
        "Meetings": [
            {
                "Activity": "Prepare for a congregation meeting",
                "Description": "Prepare a portion of a congregation meeting."
            },
            {
                "Activity": "Rehearse comments",
                "Description": "Prepare and rehearse comments. Take note of timing."
            },
            {
                "Activity": "Practice Kingdom songs",
                "Description": "Practice Kingdom songs."
            },
            {
                "Activity": "Encourage someone",
                "Description": "Discuss and practice what to say to encourage someone before or after the next meeting."
            },
            {
                "Activity": "Rehearse a student assignment",
                "Description": "Rehearse an upcoming student assignment in front of the family."
            }
        ],
        "Ministry": [
            {
                "Activity": "Prepare for house-to-house ministry",
                "Description": "Prepare for the house-to-house ministry."
            },
            {
                "Activity": "Prepare for return visits",
                "Description": "Prepare for your return visits."
            },
            {
                "Activity": "Practice informal witnessing",
                "Description": "Imagine an informal setting, and then practice how to start a friendly conversation."
            },
            {
                "Activity": "Set ministry goals",
                "Description": "Discuss specific goals for expanding your ministry during the Memorial season or during time off from work or school."
            }
        ],
        "Needs Of The Family": [
            {
                "Activity": "Practice handling situations",
                "Description": "Have a practice session on how to handle a specific situation that has arisen or is likely to arise, such as those involving neutrality, bullying, dating, or holidays."
            },
            {
                "Activity": "Role reversal session",
                "Description": "Have a practice session where parents and children reverse roles. The children research the subject and then reason with the parents."
            }
        ],
        "Additional Suggestions": [
            {
                "Activity": "Watch and discuss a program",
                "Description": "Watch and discuss a JW Broadcasting® program."
            },
            {
                "Activity": "Read or watch, then discuss",
                "Description": "Read an article or watch a video from jw.org, and then discuss it."
            },
            {
                "Activity": "Consider resources for youth",
                "Description": "Consider something from the 'Teens & Young Adults' or 'Children' sections found under the BIBLE TEACHINGS tab on jw.org."
            },
            {
                "Activity": "Review notes from a convention or assembly",
                "Description": "Review notes from a convention or an assembly."
            },
            {
                "Activity": "Research creation",
                "Description": "Observe or research an aspect of creation, and then discuss what it teaches us about Jehovah."
            },
            {
                "Activity": "Interview a guest",
                "Description": "Occasionally invite someone to join you, and then interview him."
            },
            {
                "Activity": "Set and discuss spiritual goals",
                "Description": "Set spiritual goals, and discuss how to reach them."
            },
            {
                "Activity": "Work on a project together",
                "Description": "Work on a project together, such as a model, a map, or a chart."
            }
        ]
    };

    document.getElementById('generateBtn').addEventListener('click', function () {
        // Show the loader and hide the random data
        document.getElementById('loader').style.display = 'block';
        document.getElementById('randomData').style.display = 'none';

        // Random delay between 2 and 5 seconds
        const delay = Math.floor(Math.random() * 500) + 500;

        setTimeout(function () {
            const categoryKeys = Object.keys(data);
            const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const activities = data[randomCategory];
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];

            // Construct the HTML string
            const randomData = `
            <strong>Category:</strong> ${randomCategory}<br>
            <strong>Activity:</strong> ${randomActivity.Activity}<br>
            <strong>Description:</strong> ${randomActivity.Description}
        `;

            // Set the innerHTML to format the text and hide the loader
            document.getElementById('randomData').innerHTML = randomData;
            document.getElementById('randomData').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
        }, delay);
    });
}
