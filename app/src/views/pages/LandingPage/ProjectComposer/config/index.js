import Start from "../Stages/Start";
import Description from "../Stages/Description";
import Scope from "../Stages/Scope";
import Location from "../Stages/Location";
import Fielders from "../Stages/Fielders";

export const form = {
    form: "projectcomposer",
    initialValues: {
        stage: "start",
        start: {
            first_name: "",
            last_name: "",
            phone: "",
            email_address: "",
            survey_type: undefined,
            start_date: new Date().addDays(7),
            end_date: new Date().addDays(8),
        },
        description: {
            project_name: "",
            project_summary: "",
            project_objectives: "",
        },
        scope: {
            questions: [],
            format: "written",
            countries: [],
        },
        values: {
            start: {
                first_name: "",
                last_name: "",
                phone: "",
                email_address: "",
                survey_type: undefined,
                start_date: new Date().addDays(7),
                end_date: new Date().addDays(8),
            },
            description: {
                project_name: "",
                project_summary: "",
                project_objectives: "",
            },
            scope: {
                questions: [],
                format: "written",
                countries: [],
            },
        }

    }
};
export const stages = {
    start: {
        title: "Start a Project",
        description: "It takes under 5 minutes to fill the information you'd like us to collect, then sit back, relax and let us do the heavy lifting.",
        component: Start,
    },
    description: {
        title: "Description",
        description: "",
        component: Description
    },
    scope: {
        title: "Select Scope",
        description: "",
        component: Scope
    },
    location: {
        title: "Select your Survey's/Response boundaries ",
        description: "To select or unselect a boundary Press Ctrl and click on the desired political Boundary \n. Click On an administrative boundary to get it's sub administrative boundary. Right click a boundary to highlight its apical boundary",
        component: Location
    },
    fielders: {
        title: "Select Fielders",
        description: "",
        component: Fielders
    },
};

