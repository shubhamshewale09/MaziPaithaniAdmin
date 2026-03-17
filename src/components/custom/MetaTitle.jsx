import { Helmet } from "react-helmet-async";

const MetaTitle = ({ title }) => {

    return (
        <Helmet>
            <title>{title} | माझी पैठणी</title>
        </Helmet>
    );
};

export default MetaTitle;
