import Start from "../Stages/Start";
import Description from "../Stages/Description";
import Scope from "../Stages/Scope";
import Target from "../Stages/Target";
// import Respondents from "../Stages/Respondents";
import Workforce from "../Stages/Workforce";
import Review from "../Stages/Review";


export const form = {
    name: "projectcomposer",
    mode: "onChange",
    defaultValues: {
        stage: "start",
        stages: {
            start: {
                first_name: "",
                last_name: "",
                phone: "",
                email_address: "",
                survey_type: undefined,
                start_date: new Date().addDays(7),
                end_date: new Date().addDays(14),
            },
            description: {
                project_name: "",
                project_summary: "",
                project_objectives: "",
            },
            scope: {
                questions: [],
                format: "Written",
                countries: [],
            },
            target: {
                confidence_level: "85",
                error_margin: "10",
                sample_size: 1000,
                regions: [],
            },
            workforce: {
                fielders: [],
                autoSelect: true,
            },
            review: {

            }
        },
        complete_stages: []

    },
    // resolver: yupResolver(validationSchema),
    // resolver: async (data) => {
    //     
    //     let errors = {
    //         stages: {}
    //     };
    //     if (String.isEmpty(data?.test)) {
    //         errors.test = {

    //         }
    //     }
    //     if (data?.stages?.start) {
    //         errors.stages.start = {}

    //     }
    //     return {
    //         values: data,
    //         errors: errors
    //     };

    // },
    persistOnChange: ["stage"],
    onSubmit: (values) => {

    }
};

export const stages = {
    start: {
        title: "Start",
        subtitle: "Project Start Details",
        description: "It takes under 5 minutes to fill the information you'd like us to collect, then sit back, relax and let us do the heavy lifting.",
        component: Start,
    },
    description: {
        title: "Description",
        subtitle: "Project Description",
        description: "",
        component: Description
    },
    scope: {
        title: "Scope",
        subtitle: "Project's Scope",
        description: "",
        component: Scope
    },
    target: {
        title: "Target ",
        subtitle: "Project's Respondents Target",
        description: "To select or unselect a boundary Press Ctrl and click on the desired political Boundary \n. Click On an administrative boundary to get it's sub administrative boundary. Right click a boundary to highlight its apical boundary",
        component: Target
    },
    // respondents: {
    //     title: "Respondents",
    //     subtitle: "Project's Respondents Selection",
    //     description: "To select or unselect a boundary Press Ctrl and click on the desired political Boundary \n. Click On an administrative boundary to get it's sub administrative boundary. Right click a boundary to highlight its apical boundary",
    //     component: Respondents
    // },
    workforce: {
        title: "Workforce",
        subtitle: "Select Workforce",
        description: "",
        component: Workforce
    },
    review: {
        title: "Review",
        subtitle: "Project Overview & Review",
        description: "Project Overview & Review",
        component: Review
    }
};

