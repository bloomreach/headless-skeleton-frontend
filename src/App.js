import {
    getContainerItemContent, isComponent,
    isContainer,
    TYPE_CONTAINER_ITEM_UNDEFINED,
    TYPE_CONTAINER_NO_MARKUP
} from "@bloomreach/spa-sdk";
import {BrComponent, BrPage, BrPageContext} from "@bloomreach/react-sdk";
import axios from "axios";
import {Box, Card, CardContent, Container, Paper, Tab, Tabs, Typography} from "@mui/material";
import React from "react";
import ReactJson from "react-json-view";

function App({location}) {

    const urlParams = new URLSearchParams(location.search);
    const endpoint = urlParams.get('endpoint');

    return (

        <Container>
            <BrPage configuration={{
                path: `${location.pathname}${location.search}`,
                endpoint: endpoint ?? process.env.REACT_APP_BRXM_ENDPOINT ?? 'https://kenan.bloomreach.io/delivery/site/v1/channels/brxsaas/pages',
                endpointQueryParameter: 'endpoint',
                httpClient: axios
            }} mapping={{
                [TYPE_CONTAINER_ITEM_UNDEFINED]: SkeletonContainerItemComponent,
                [TYPE_CONTAINER_NO_MARKUP]: SkeletonContainer
            }}>
                <BrPageContext.Consumer>
                    {page => {
                        console.log(page)
                        return <>
                            <header>
                                <Box p={2}>
                                    <h2>layout: {page && `${page.getComponent().getName()}`}</h2>
                                    <h2>path: {`${location.pathname}`}</h2>
                                    <ReactJson collapsed={true} name={'page'} src={page}/>
                                </Box>
                            </header>
                            <main>{page.getComponent().getChildren().map(component => {
                                return <div key={component.getId()}><BrComponent path={component.getName()}/></div>
                            })}</main>
                        </>
                    }}
                </BrPageContext.Consumer>

            </BrPage>
        </Container>
    );
}

export function SkeletonContainer({component, page}) {
    return (
        <div>
            <Paper elevation={5}>
                <Box p={2}>
                    <Typography h={2}
                                align={"center"}>Container: {component.getName()} - {component.getId()}</Typography>
                    <ReactJson collapsed={true} name={'container'} src={component}/>
                </Box>
                {component.getChildren() &&
                <div>
                    <BrComponent/>
                </div>
                }
            </Paper>
        </div>
    )

}

export function SkeletonContainerItemComponent({component, page}) {

    const content = getContainerItemContent(component, page) ?? undefined;
    const parameters = component.getParameters()

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Card variant={"elevation"} style={{marginBottom: 10}}>
            <Typography h={3} align={"center"}>Container Item Component: {component.getLabel()}</Typography>
            <CardContent>
                <Box sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex', marginBottom: '30px'}}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{borderRight: 1, borderColor: 'divider'}}
                    >
                        <Tab label="Component" {...a11yProps(0)} />
                        {content && <Tab label="Content" {...a11yProps(1)} />}
                        <Tab label="Properties" {...a11yProps(content ? 2 : 1)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <ReactJson collapsed={true} name={'component'} src={component}/>
                    </TabPanel>
                    {content && <TabPanel value={value} index={1}>
                        <ReactJson collapsed={true} name={'content'} src={content}/>
                    </TabPanel>}
                    <TabPanel value={value} index={content ? 2 : 1}>
                        <ReactJson collapsed={true} name={'properties'} src={parameters}/>
                    </TabPanel>
                </Box>
            </CardContent>
        </Card>
    )

}


function a11yProps(index)
{
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function TabPanel(props)
{
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}


export default App;
