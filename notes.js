// ================================
// SkillBridge - Complete Notes
// ================================


// Complete Notes links
const notesLinks = {

    // Python
    "Python":
        "https://ocw.mit.edu/courses/6-189-a-gentle-introduction-to-programming-using-python-january-iap-2008/pages/lecture-notes/",


    // C
    "C":
        "https://ocw.mit.edu/courses/6-s096-introduction-to-c-and-c-january-iap-2013/download/",


    // C++
    "C++":
        "https://ocw.mit.edu/courses/6-s096-introduction-to-c-and-c-january-iap-2013/download/",


    // Java
    "Java":
        "https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/download/",


    // AI
    "AI":
        "https://share.google/WnWSjGfUDzhpitwgz",


    // ML
    "ML":
        "https://developers.google.com/machine-learning/crash-course/",


    // Gen AI
    "Gen AI":
        "",


    // CS
    "CS":
        "https://www.nist.gov/cyberframework",


    // DS
    "DS":
        "https://share.google/4SJumX3LRGopt27uG",


    // AWS
    "AWS":
        "https://docs.aws.amazon.com/",


    // IoT
    "IoT":
        "https://archive.nptel.ac.in/content/syllabus_pdf/106105166.pdf"
};


// ================================
// Open Complete Notes
// ================================

function openNotes(technology) {

    const link = notesLinks[technology];


    // If link is not available
    if (!link) {

        alert(
            "Complete Notes link is not added yet for " +
            technology
        );

        return;
    }


    // Open resource in new tab
    window.open(link, "_blank");

}