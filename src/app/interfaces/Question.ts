export interface Question {
    _class: string,
    _id: {
        $oid: string
    },
    assessment_type: string,
    correct_response: string[],
    id: number,
    prompt: {
        answers: string[],
        explanation: string,
        feedbacks: string[],
        question: string,
        relatedLectureIds: string
    }
    question_plain: string,
    section: string
}

export interface Questions {
    documents: Question[]
}