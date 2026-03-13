import { Helmet } from "react-helmet-async";

const MetaTitle = ({ title }) => {

    return (
        <Helmet>
            <title>{title} | Kumbha.ai</title>
        </Helmet>
    );
};

export default MetaTitle;
