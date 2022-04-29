import {getContainerItemContent, TYPE_CONTAINER_ITEM_UNDEFINED, TYPE_CONTAINER_NO_MARKUP} from "@bloomreach/spa-sdk";
import {BrComponent, BrManageContentButton, BrPage, BrPageContext} from "@bloomreach/react-sdk";
import axios from "axios";
import './app.css'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, Drawer, IconButton,
    Link,
    Paper,
    SpeedDial,
    SpeedDialAction,
    Step,
    StepLabel,
    Stepper, styled,
    SvgIcon,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from "@mui/material";
import React, {useContext} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ReactJson from "react-json-view";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {CopyBlock, github} from "react-code-blocks";
import {codeTemplates} from "./code-templates";
import HelpCenterOutlinedIcon from '@mui/icons-material/HelpCenterOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import {cheatsheet} from "./cheatsheet";
import {ErrorContext} from "./ErrorContext";
import {Cookies} from "react-cookie";
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import ModeProvider, {advanced, ModeContext, simple} from "./ModeContext";

var traverse = require('traverse');

function flatten(arr, parent) {
    return arr ? arr.reduce((result, item) => [
        ...result,
        {
            path: `${parent ? parent + '/' : ''}${item.getName()}`,
            type: item.model.type,
            id: item.model.id
        },
        ...flatten(item.children, `${parent ? parent + '/' : ''}${item.getName()}`)
    ], []) : [];
}

const cookies = new Cookies();

const drawerWidth = 292;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));



function App({location}) {

    const {errorCode, error} = useContext(ErrorContext);

    const urlParams = new URLSearchParams(location.search);
    const endpoint = urlParams.get('endpoint');
    const token = urlParams.get('token');

    const endpointUrl = endpoint ?? process.env.REACT_APP_BRXM_ENDPOINT ?? 'https://sandbox-sales02.bloomreach.io/delivery/site/v1/channels/brxsaas/pages'

    const re = new RegExp('channels\\/(.*)\\/pages');
    const channel = re.exec(endpointUrl)?.length > 0 ? re.exec(endpointUrl)[1] : 'unknown (paas)';

    const [componentDialogOpen, setComponentDialogOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [cheatSheetDialogOpen, setCheatSheetDialogOpen] = React.useState(false);
    const [firstTimeDialogOpen, setFirstTimeDialogOpen] = React.useState(!cookies.get(`${channel}ShowFirstTimeDialog`));



    if (errorCode) {
        return (
            <Container>
                <Paper sx={{padding: 3, backgroundColor: "ghostwhite", marginTop: 1}} square>
                    <h3 align={"center"}>{error.toString()}</h3>
                    <Alert sx={{margin: 2}} variant={"outlined"} severity={"warning"}>
                        <Typography>This could be related
                            to a
                            misconfigured route</Typography>
                    </Alert>
                </Paper>
            </Container>)
    }


    return (
        <ModeProvider>
            <Container>
                <ModeContext.Consumer>
                    {({mode, setMode}) => {
                        return (<BrPage configuration={{
                            path: `${location.pathname}${location.search}`,
                            endpoint: endpoint ?? process.env.REACT_APP_BRXM_ENDPOINT ?? 'https://sandbox-sales02.bloomreach.io/delivery/site/v1/channels/brxsaas/pages',
                            endpointQueryParameter: 'endpoint',
                            debug: true,
                            httpClient: axios
                        }} mapping={{
                            [TYPE_CONTAINER_ITEM_UNDEFINED]: SkeletonContainerItemComponent,
                            [TYPE_CONTAINER_NO_MARKUP]: SkeletonContainer
                        }}>
                            <BrPageContext.Consumer>
                                {page => {
                                    const menus = Object.values(page.model.page).filter(component => component.type === 'menu');
                                    const embedUrl = page.getChannelParameters()['__appetize.io_embed'];
                                    // console.log(flatten(page.getComponent().getChildren()).filter(value => value.type === 'container'))
                                    const baseActions = [
                                        {
                                            icon: <PreviewOutlinedIcon/>,
                                            name: `Preview`,
                                            onClick: () => setDrawerOpen(true)
                                        },
                                        {
                                            icon: mode === 0 ? <ToggleOnOutlinedIcon/> : <ToggleOffOutlinedIcon/>,
                                            name: `Switch to ${mode === 0 ? 'advanced' : 'simple'} view`,
                                            onClick: () => {
                                                setMode(mode === simple ? advanced : simple)
                                            }
                                        },
                                        {
                                            icon: <HelpCenterOutlinedIcon/>,
                                            name: 'Getting started?',
                                            onClick: () => window.open('https://documentation.bloomreach.com/developers/content/get-started/get-started---introduction.html', '_blank')
                                        },
                                        {
                                            icon: <ListAltOutlinedIcon/>, name: 'Cheat Sheet',
                                            onClick: () => setCheatSheetDialogOpen(true)
                                        },


                                    ]
                                    const actions = (/*page.model.meta.branch !== 'master' && */page.isPreview()) ? [
                                        {
                                            icon: <RocketLaunchOutlinedIcon/>,
                                            name: 'Welcome',
                                            onClick: () => setFirstTimeDialogOpen(true),
                                            disabled: false
                                        }
                                    ].concat(baseActions) : baseActions
                                    return <>
                                        {embedUrl && <Drawer
                                            sx={{
                                                width: drawerWidth,
                                                flexShrink: 0,
                                                '& .MuiDrawer-paper': {
                                                    width: drawerWidth,
                                                    boxSizing: 'border-box',
                                                },
                                            }}
                                            variant="persistent"
                                            anchor="left"
                                            open={drawerOpen}
                                        >
                                            <DrawerHeader>
                                                <Typography variant={"h6"}>Appetize.io Emulator</Typography>
                                                <IconButton onClick={()=> setDrawerOpen(false)}>
                                                    <ChevronLeftIcon />
                                                </IconButton>
                                            </DrawerHeader>
                                            <Divider />
                                            <iframe style={{height:'100%'}} title={"appetize.io emulator"} src={embedUrl} />
                                        </Drawer>}
                                        <header key={'header'}>
                                            <SpeedDial
                                                sx={{position: 'fixed', top: 16, right: 16, zIndex: 999999}}
                                                icon={<InfoOutlinedIcon/>}
                                                direction={'down'}
                                                ariaLabel={'quick menu'}
                                            >
                                                {actions.map((action) => (
                                                    <SpeedDialAction
                                                        key={action.name}
                                                        icon={action.icon}
                                                        tooltipTitle={action.name}
                                                        onClick={action.onClick}
                                                        hidden={action.disabled}
                                                        aria-disabled={action.disabled}
                                                    />

                                                ))}
                                            </SpeedDial>
                                            <ComponentDialog open={componentDialogOpen}
                                                             handleClose={() => setComponentDialogOpen(false)}/>
                                            <CheatSheetDialog open={cheatSheetDialogOpen}
                                                              handleClose={() => setCheatSheetDialogOpen(false)}/>
                                            {/*<PreviewDialog open={previewDialogOpen}*/}
                                            {/*               handleClose={() => setPreviewDialogOpen(false)}/>*/}
                                            {mode !== simple &&
                                            <FirstTimeDialog open={page.isPreview() && firstTimeDialogOpen}
                                                             handleClose={() => {
                                                                 cookies.set(`${channel}ShowFirstTimeDialog`, false, {
                                                                     secure: true,
                                                                     sameSite: 'none'
                                                                 });
                                                                 setFirstTimeDialogOpen(false);
                                                             }} endpointUrl={endpointUrl}/>}
                                            <Accordion key={'context'}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon/>}
                                                    disabled={mode === 0}
                                                    aria-controls="context"
                                                    id="context">
                                                    <Typography sx={{width: '33%', flexShrink: 0}}>
                                                        Context
                                                    </Typography>
                                                    <Typography
                                                        sx={{color: 'text.secondary'}}>{`${location.pathname}`}
                                                    </Typography>
                                                </AccordionSummary>
                                                {mode !== simple &&
                                                <AccordionDetails>
                                                    <h2>channel: {channel}</h2>
                                                    <h2>branch: {page.model.meta.branch}</h2>
                                                    <h2>preview: {page.isPreview().toString()}</h2>
                                                    <h2>path: {`${location.pathname}`}</h2>
                                                    {page.isPreview() && <h2>token: {token}</h2>}
                                                    <h2>api endpoint: <a rel={'noreferrer'} target={'_blank'}
                                                                         href={endpointUrl + location.pathname}>{endpointUrl}{location.pathname}</a>
                                                    </h2>
                                                </AccordionDetails>}
                                            </Accordion>
                                            <Accordion key={'page'}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon/>}
                                                    aria-controls="page"
                                                    id="page"
                                                    disabled={mode === 0}
                                                >
                                                    <Typography sx={{width: '33%', flexShrink: 0}}>
                                                        Page
                                                    </Typography>
                                                    <Typography
                                                        sx={{color: 'text.secondary'}}>{page && `${page.getComponent().model.label ?? page.getComponent().getName()}`}</Typography>
                                                </AccordionSummary>
                                                {mode !== simple &&
                                                <AccordionDetails>
                                                    <h2>layout: {page && `${page.getComponent().model.label ?? page.getComponent().getName()}`}</h2>
                                                    <ReactJson style={{padding: 2, marginBottom: 2}} collapsed={true}
                                                               name={'page'}
                                                               src={page}/>

                                                    <ReactJson style={{padding: 2, marginBottom: 2}} collapsed={true}
                                                               name={'channel parameters'}
                                                               src={page.getChannelParameters()}/>


                                                    <ReactJson style={{padding: 2, marginBottom: 2}} collapsed={true}
                                                               name={'page elements'} src={page.model.page}/>

                                                    {page.getDocument()?.model &&

                                                    <ReactJson style={{padding: 2}} collapsed={true}
                                                               name={'page document'}
                                                               src={page.getDocument()?.model}/>}

                                                </AccordionDetails>}
                                            </Accordion>
                                            {menus.length > 0 && <Accordion key={'menu'}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon/>}
                                                    aria-controls="menu"
                                                    id="menu"
                                                >
                                                    <Typography>Menus</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {menus.map(component => {
                                                        return (
                                                            <Box key={component.data.name} sx={{position: 'relative'}}>
                                                                <h2>{component.data.name}</h2>
                                                                {page.isPreview() && <div
                                                                    dangerouslySetInnerHTML={{__html: component.meta.beginNodeSpan[0].data}}/>}
                                                            </Box>
                                                        )
                                                    })}
                                                </AccordionDetails>
                                            </Accordion>}
                                        </header>
                                        <main
                                            key={'main'}>{flatten(page.getComponent().getChildren()).filter(value => value.type === 'container').map(component => {
                                            return (
                                                <div key={component.id}>
                                                    <BrComponent path={component.path}/>
                                                </div>)
                                        })}</main>
                                    </>
                                }}
                            </BrPageContext.Consumer>
                        </BrPage>)
                    }}
                </ModeContext.Consumer>

            </Container>
        </ModeProvider>
    );
}

function SkeletonContainer({component, page}) {

    const [codeBoxOpen, setCodeBoxOpen] = React.useState(false);
    const path = flatten(page.getComponent().getChildren()).filter(cmp => cmp.id === component.model.id)[0].path;

    const [template, setTemplate] = React.useState('reactJsx');
    const [language, setLanguage] = React.useState('jsx');

    const handleSelected = (event, newSelected) => {
        if (newSelected) {
            setTemplate(newSelected)
            setLanguage(codeTemplates[newSelected].language)
        }
    };

    return (
        <ModeContext.Consumer>
            {({mode}) => {
                return (<>
                    <Paper sx={{padding: 3, backgroundColor: "gainsboro", marginTop: 1, position: 'relative'}} square>
                        <h3 align={"center"}>{component.model.label ?? `${component.getName()} - ${component.getId()}`}</h3>
                        {(page.isPreview() && component.getChildren().length === 0) &&
                        <Alert sx={{margin: 2}} variant={"outlined"} severity={"warning"}>
                            <Typography>This is an empty container, components can be added here!</Typography>
                        </Alert>}
                        {mode !== simple &&
                        <>
                            <ReactJson collapsed={true} name={'container'} src={component.model}/>
                            <ToggleButton value={'containerCode'} sx={{position: "absolute", bottom: 10, right: 10}}
                                          size={"small"}
                                          onClick={() => setCodeBoxOpen(!codeBoxOpen)}
                                          selected={codeBoxOpen}>
                                <CodeOutlinedIcon fontSize={'1'}/>
                            </ToggleButton>
                            <Box sx={{display: codeBoxOpen ? 'block' : 'none', marginY: 2}}>
                                <Container>
                                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                        <Box sx={{flex: '1 1 auto'}}/>
                                        <ToggleButtonGroup
                                            value={template}
                                            exclusive
                                            size={"small"}
                                            onChange={(event, value1) => handleSelected(event, value1)}
                                            aria-label="text alignment"
                                        >
                                            <ToggleButton value="reactJsx" aria-label="reactJsx">
                                                <SvgIcon>
                                                    <path
                                                        d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zM16.795 22.677c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zM12 16.878c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
                                                </SvgIcon>
                                                <SvgIcon fontSize={"1"}
                                                         sx={{position: "absolute", right: 4, bottom: 2}}>
                                                    <path
                                                        d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>
                                                </SvgIcon>
                                            </ToggleButton>
                                            <ToggleButton value="vueJs" aria-label="vueJs">
                                                <SvgIcon>
                                                    <path
                                                        d="M19.197 1.608l.003-.006h-4.425L12 6.4v.002l-2.772-4.8H4.803v.005H0l12 20.786L24 1.608"/>
                                                </SvgIcon>
                                                <SvgIcon fontSize={"1"}
                                                         sx={{position: "absolute", right: 4, bottom: 2}}>
                                                    <path
                                                        d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>
                                                </SvgIcon>
                                            </ToggleButton>
                                            <ToggleButton value="angular" aria-label="angular">
                                                <SvgIcon>
                                                    <path
                                                        d="M9.93 12.645h4.134L11.996 7.74M11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z"/>
                                                </SvgIcon>
                                                <SvgIcon fontSize={"1"}
                                                         sx={{position: "absolute", right: 4, bottom: 2}}>
                                                    <path
                                                        d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"/>
                                                </SvgIcon>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>
                                    <div>
                                        <CopyBlock
                                            language={language}
                                            text={codeTemplates[template]?.container?.replaceAll('{path}', path)}
                                            showLineNumbers={false}
                                            theme={github}
                                            wrapLines={true}
                                            codeBlock
                                        />
                                    </div>
                                </Container>
                            </Box>
                        </>
                        }
                    </Paper>
                    {
                        component.getChildren() &&
                        <BrComponent/>
                    }
                </>)
            }}
        </ModeContext.Consumer>
    )

}

function CheatSheetDialog({open, handleClose}) {

    return (<Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        sx={{zIndex: 99999999}}
    >
        <DialogTitle>
            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                <Typography variant={"h5"}>Cheat Sheet</Typography>
                <Box sx={{flex: '1 1 auto'}}/>
            </Box>
        </DialogTitle>
        <DialogContent>
            <Box>
                {cheatsheet.map((item, index) => {
                    return (
                        <div key={index}>
                            <Typography variant={"h6"}>{item.heading}</Typography>
                            <CopyBlock
                                language={'jsx'}
                                text={item.reactJsx}
                                showLineNumbers={false}
                                theme={github}
                                wrapLines={true}
                                codeBlock
                            />
                        </div>
                    )
                })}
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>);

}


function ComponentDialog({open, handleClose}) {

    const steps = ['Component Definition', 'Component Content', 'Component Properties'];

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        handleClose();
    };

    return (<Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        sx={{zIndex: 99999999}}
    >
        <DialogTitle>Create Simple Component</DialogTitle>
        <DialogContent>
            <Box sx={{width: '100%'}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (<Typography sx={{mt: 2, mb: 1}}>Component .. created</Typography>) :
                    (<Typography sx={{mt: 2, mb: 1}}>Step {activeStep + 1}</Typography>)}
            </Box>
        </DialogContent>

        <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
            <Button
                color="inherit"
                disabled={activeStep === 0 || activeStep === steps.length}
                onClick={handleBack}
                sx={{mr: 1}}
            >
                Back
            </Button>
            <Box sx={{flex: '1 1 auto'}}/>
            <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
            <Button onClick={handleReset}>Close</Button>
        </Box>
    </Dialog>);
}

function Item(props) {
    const {sx, ...other} = props;
    return (
        <Box
            sx={{
                ...sx,
            }}
            {...other}
        />
    );
}

export function SkeletonContainerItemComponent({component, page}) {

    const content = getContainerItemContent(component, page) ?? undefined;
    const properties = component.getParameters()
    const pagedocument = page.getDocument()?.getData();

    const [value, setValue] = React.useState(component.getLabel() !== 'Content' ? 0 : content ? 4 : 3);

    const references = []
    traverse(component).forEach(function (x) {
        if (x != null && x.$ref)
            references.push(x.$ref);
    });

    const documents = references.map(ref => page.getContent(ref)).filter(item => item?.model?.type === 'document');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [template, setTemplate] = React.useState('reactJsx');
    const [language, setLanguage] = React.useState('jsx');

    const handleSelected = (event, newSelected) => {
        if (newSelected) {
            setTemplate(newSelected)
            setLanguage(codeTemplates[newSelected].language)
        }
    };


    return (
        <ModeContext.Consumer>
            {({mode}) => {
                return (
                    <Card variant={"elevation"} style={{marginBottom: 10, position: 'relative'}}>
                        <h4 style={{marginBottom: 0, marginTop: 10}} align={"center"}>{component.getLabel()}</h4>
                        <CardContent>
                            {documents.map(document => {
                                return (<BrManageContentButton key={document.getId()} content={document}/>)
                            })}
                            {mode !== simple &&
                            <Box sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}>
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
                                    <Tab label="Code" {...a11yProps(content ? 3 : 2)} />
                                    <Tab label="View" {...a11yProps(content ? 4 : 3)} />
                                </Tabs>
                                <TabPanel value={value} index={0}>
                                    <ReactJson collapsed={1} name={'component'} src={component.model}/>
                                    <ToggleButton value={'componentCode'}
                                                  sx={{position: "absolute", bottom: 10, right: 10}}
                                                  size={"small"}
                                                  onClick={() => setValue(content ? 3 : 2)}>
                                        <CodeOutlinedIcon fontSize={'1'}/>
                                    </ToggleButton>
                                </TabPanel>
                                {content && <TabPanel value={value} index={1}>
                                    <ReactJson collapsed={1} name={'content'} src={content}/>
                                </TabPanel>}
                                <TabPanel value={value} index={content ? 2 : 1}>
                                    <ReactJson collapsed={1} name={'properties'} src={properties}/>
                                </TabPanel>
                                <TabPanel value={value} index={content ? 3 : 2}>
                                    <Box sx={{display: 'flex', justifyContent: 'flex-start',}}>
                                        <Item>
                                            <ToggleButtonGroup
                                                value={template}
                                                exclusive
                                                size={"medium"}
                                                onChange={(event, value1) => handleSelected(event, value1)}
                                                aria-label="text alignment"
                                            >
                                                <ToggleButton size={'medium'} value="reactJsx" aria-label="reactJsx">
                                                    <SvgIcon>
                                                        <path
                                                            d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zM16.795 22.677c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zM12 16.878c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/>
                                                    </SvgIcon>
                                                    <SvgIcon fontSize={"1"}
                                                             sx={{position: "absolute", right: 4, bottom: 2}}>
                                                        <path
                                                            d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>
                                                    </SvgIcon>
                                                </ToggleButton>
                                                <ToggleButton value="vueJs" aria-label="vueJs">
                                                    <SvgIcon>
                                                        <path
                                                            d="M19.197 1.608l.003-.006h-4.425L12 6.4v.002l-2.772-4.8H4.803v.005H0l12 20.786L24 1.608"/>
                                                    </SvgIcon>
                                                    <SvgIcon fontSize={"1"}
                                                             sx={{position: "absolute", right: 4, bottom: 2}}>
                                                        <path
                                                            d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z"/>
                                                    </SvgIcon>
                                                </ToggleButton>
                                                <ToggleButton value="angular" aria-label="angular">
                                                    <SvgIcon>
                                                        <path
                                                            d="M9.93 12.645h4.134L11.996 7.74M11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z"/>
                                                    </SvgIcon>
                                                    <SvgIcon fontSize={"1"}
                                                             sx={{position: "absolute", right: 4, bottom: 2}}>
                                                        <path
                                                            d="M3,3H21V21H3V3M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86M13,11.25H8V12.75H9.5V20H11.25V12.75H13V11.25Z"/>
                                                    </SvgIcon>
                                                </ToggleButton>
                                            </ToggleButtonGroup></Item>
                                        <Item> <Alert style={{marginLeft: 4}} severity={"info"}>Click
                                            on the <Link sx={{cursor: "pointer"}}
                                                         onClick={() => setValue(content ? 4 : 3)}>"view"</Link> tab to
                                            see the
                                            result
                                            of the
                                            following code snippet</Alert></Item>
                                    </Box>
                                    <CopyBlock
                                        language={language}
                                        text={codeTemplates[template]?.component?.replaceAll('{componentname}', component.model.ctype)}
                                        showLineNumbers={false}
                                        theme={github}
                                        wrapLines={true}
                                        codeBlock
                                        // highlight={codeTemplates[template].componentHighLight}
                                    />
                                    <Divider/>
                                    <Alert style={{marginTop: 4}} severity={"info"}>Add the component to the mapping of
                                        the
                                        BrPage
                                        element:</Alert>
                                    <CopyBlock
                                        language={language}
                                        text={codeTemplates[template]?.BrPage?.replaceAll('{componentname}', component.model.ctype)}
                                        showLineNumbers={false}
                                        theme={github}
                                        wrapLines={true}
                                        codeBlock
                                        highlight={codeTemplates[template].brPageHighLight}
                                    />
                                </TabPanel>
                                <TabPanel value={value} index={content ? 4 : 3}>
                                    <div>
                                        <h4>{component.getName()}</h4>
                                        {content && <pre>content: {JSON.stringify(content, null, 2)}</pre>}
                                        {(properties && Object.keys(properties).length !== 0) &&
                                        <pre>properties: {JSON.stringify(properties, null, 2)}</pre>}
                                        <pre style={{position: 'relative'}}><BrManageContentButton
                                            key={component.getName() + 'page-doc'}
                                            content={page.getDocument()}/>page document: {JSON.stringify(pagedocument, null, 2)}</pre>
                                    </div>
                                    <ToggleButton value={'componentCode'}
                                                  sx={{position: "absolute", bottom: 10, right: 10}}
                                                  size={"small"}
                                                  onClick={() => setValue(content ? 3 : 2)}>
                                        <CodeOutlinedIcon fontSize={'1'}/>
                                    </ToggleButton>
                                </TabPanel>
                            </Box>
                            }
                        </CardContent>
                    </Card>)
            }}
        </ModeContext.Consumer>
    )

}


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            style={{width: '100%'}}
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function FirstTimeDialog({open, handleClose, endpointUrl}) {

    return (<Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        sx={{zIndex: 99999999}}
    >
        <DialogTitle>
            <Typography textAlign={"center"} variant={"h4"}>Welcome Developer</Typography>
        </DialogTitle>
        <DialogContent>
            <Box>
                <Typography textAlign={"center"} m={2}>You are currently looking at the default frontend application
                    that gets shipped with the headless experience manager. Following the below tutorials you will be
                    able to consume our api and create frontend application of your
                    own</Typography>

                <Typography textAlign={"center"} variant={"h6"}>Step one: generate a frontend project</Typography>
                <br/>
                <CopyBlock
                    language={'bash'}
                    text={`npx create-react-app my-react-content-app
# or
yarn create react-app my-react-content-app`}
                    showLineNumbers={false}
                    theme={github}
                    wrapLines={true}
                    codeBlock
                />

                <Typography textAlign={"center"} variant={"h6"}>Step two: install required dependencies</Typography>
                <br/>
                <CopyBlock
                    language={'bash'}
                    text={`npm install @bloomreach/spa-sdk @bloomreach/react-sdk axios
# or
yarn add @bloomreach/spa-sdk @bloomreach/react-sdk axios`}
                    showLineNumbers={false}
                    theme={github}
                    wrapLines={true}
                    codeBlock
                />
                <br/>
                <Typography textAlign={"center"} variant={"h6"}>Step three: Place the BrPage Element to a placeholder in
                    the render method of your App.js file</Typography>
                <br/>
                <CopyBlock
                    language={'jsx'}
                    text={`import axios from "axios";
import {BrPage} from "@bloomreach/react-sdk";

<BrPage configuration={{
            path:\`\${window.location.pathname}\${window.location.search}\`,
            endpoint: '${endpointUrl}',
            httpClient: axios
        }} 
        mapping={{Content}}>
</BrPage>`}
                    showLineNumbers={false}
                    theme={github}
                    wrapLines={true}
                    codeBlock
                />
                <br/>
                <Typography textAlign={"center"} variant={"h6"}>Step four: Add the following Component for your first
                    rendering</Typography>
                <br/>
                <Alert severity={'info'}>The <strong>Content</strong> Component will be the same as
                    the <strong>mapping</strong> from the BrPage Element in the previous step</Alert>
                <br/>
                <CopyBlock
                    language={'jsx'}
                    text={`export function Content({component, page}) {
  
   const document = page?.getDocument();
   const {title, content, introduction} = document.getData();

   return (
       <div>
           <h1>{title}</h1>
           <p>{introduction}</p>
           <div dangerouslySetInnerHTML={{__html: content.value}}/>
       </div>
   );
}`}
                    showLineNumbers={false}
                    theme={github}
                    wrapLines={true}
                    codeBlock
                />
                <br/>
                <Typography textAlign={"center"} variant={"h6"}>Step five: Add the Content Component to the
                    Container</Typography>
                <br/>
                <Typography textAlign={"center"}><img alt={'explanation on how to add components to containers'}
                                                      align={'center'}
                                                      src={`/component-to-container.gif`}/></Typography>
                <br/>
                <Typography textAlign={"center"}>And publish the Page</Typography>
                <br/>
                <Typography textAlign={"center"} m={2}>
                    <span style={{cursor: "pointer", 'text-decoration': 'underline'}}
                          onClick={() => window.open('https://documentation.bloomreach.com/developers/content/get-started/get-started---introduction.html', '_blank')}>next milestones</span></Typography>
                <Typography textAlign={"center"}>Click Close to start adding components</Typography>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Close</Button>
        </DialogActions>
    </Dialog>);

}

export default App;