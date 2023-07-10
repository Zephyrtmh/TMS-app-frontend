module.exports.processStringNotesToArray = (notesString) => {
    var notesArray = [];
    //notes content|createdBy|createDate|notes content|createdBy|createDate
    const regex = /([^|]+)\|([^|]+)\|([^|]+)/g;
    let match;
    while ((match = regex.exec(notesString))) {
        const content = match[1].trim();
        const author = match[2].trim();
        const createdate = match[3].trim();

        console.log(content, author, createdate);

        notesArray.push({ content: content, author: author, createdate: createdate });
    }

    return notesArray;
};

module.exports.addNote = async (noteToAdd) => {
    var notesArray = [];
    //notes content|createdBy|createDate|notes content|createdBy|createDate
    const regex = /([^|]+)\|([^|]+)\|([^|]+)/g;
    let match;
    while ((match = regex.exec(notesString))) {
        const segment1 = match[1].trim();
        const segment2 = match[2].trim();
        const segment3 = match[3].trim();

        notesArray.push([segment1, segment2, segment3]);
    }

    return notesArray;
};
