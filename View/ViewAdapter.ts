
///<reference path="./Elements/A"/>
///<reference path="./Elements/Abbr"/>
///<reference path="./Elements/Address"/>
///<reference path="./Elements/Area"/>
///<reference path="./Elements/Article"/>
///<reference path="./Elements/Aside"/>
///<reference path="./Elements/Audio"/>
///<reference path="./Elements/B"/>
///<reference path="./Elements/Base"/>
///<reference path="./Elements/Bdi"/>
///<reference path="./Elements/Bdo"/>
///<reference path="./Elements/Blockquote"/>
///<reference path="./Elements/Body"/>
///<reference path="./Elements/Br"/>
///<reference path="./Elements/Button"/>
///<reference path="./Elements/Canvas"/>
///<reference path="./Elements/Caption"/>
///<reference path="./Elements/Cite"/>
///<reference path="./Elements/Code"/>
///<reference path="./Elements/Col"/>
///<reference path="./Elements/ColGroup"/>
///<reference path="./Elements/Datalist"/>
///<reference path="./Elements/Db"/>
///<reference path="./Elements/Del"/>
///<reference path="./Elements/Details"/>
///<reference path="./Elements/Dfn"/>
///<reference path="./Elements/Dialog"/>
///<reference path="./Elements/Div"/>
///<reference path="./Elements/Dl"/>
///<reference path="./Elements/Dt"/>
///<reference path="./Elements/Em"/>
///<reference path="./Elements/Embed"/>
///<reference path="./Elements/Fieldset"/>
///<reference path="./Elements/Figcaption"/>
///<reference path="./Elements/Figure"/>
///<reference path="./Elements/Footer"/>
///<reference path="./Elements/Form"/>
///<reference path="./Elements/H1"/>
///<reference path="./Elements/H2"/>
///<reference path="./Elements/H3"/>
///<reference path="./Elements/H4"/>
///<reference path="./Elements/H5"/>
///<reference path="./Elements/H6"/>
///<reference path="./Elements/Head"/>
///<reference path="./Elements/Header"/>
///<reference path="./Elements/I"/>
///<reference path="./Elements/Iframe"/>
///<reference path="./Elements/Img"/>
///<reference path="./Elements/Input"/>
///<reference path="./Elements/Ins"/>
///<reference path="./Elements/Kbd"/>
///<reference path="./Elements/Keygen"/>
///<reference path="./Elements/Label"/>
///<reference path="./Elements/Leyend"/>
///<reference path="./Elements/Li"/>
///<reference path="./Elements/Link"/>
///<reference path="./Elements/Main"/>
///<reference path="./Elements/Map"/>
///<reference path="./Elements/Menu"/>
///<reference path="./Elements/MenuItem"/>
///<reference path="./Elements/Meta"/>
///<reference path="./Elements/Meter"/>
///<reference path="./Elements/Nav"/>
///<reference path="./Elements/Noscrip"/>
///<reference path="./Elements/Object"/>
///<reference path="./Elements/Ol"/>
///<reference path="./Elements/Optgroup"/>
///<reference path="./Elements/Option"/>
///<reference path="./Elements/Output"/>
///<reference path="./Elements/P"/>
///<reference path="./Elements/Param"/>
///<reference path="./Elements/Pre"/>
///<reference path="./Elements/Progress"/>
///<reference path="./Elements/Q"/>
///<reference path="./Elements/Rp"/>
///<reference path="./Elements/Rt"/>
///<reference path="./Elements/Ruby"/>
///<reference path="./Elements/S"/>
///<reference path="./Elements/Samp"/>
///<reference path="./Elements/Script"/>
///<reference path="./Elements/Section"/>
///<reference path="./Elements/Select"/>
///<reference path="./Elements/Small"/>
///<reference path="./Elements/Source"/>
///<reference path="./Elements/Span"/>
///<reference path="./Elements/Strong"/>
///<reference path="./Elements/Style"/>
///<reference path="./Elements/Sub"/>
///<reference path="./Elements/Table"/>
///<reference path="./Elements/Tbody"/>
///<reference path="./Elements/Td"/>
///<reference path="./Elements/Textarea"/>
///<reference path="./Elements/Tfoot"/>
///<reference path="./Elements/Th"/>
///<reference path="./Elements/Thead"/>
///<reference path="./Elements/Time"/>
///<reference path="./Elements/Title"/>
///<reference path="./Elements/Tr"/>
///<reference path="./Elements/Track"/>
///<reference path="./Elements/U"/>
///<reference path="./Elements/Ul"/>
///<reference path="./Elements/Var"/>
///<reference path="./Elements/Video"/>
///<reference path="./Elements/Wbr"/>

namespace View
{
    export class ViewAdapter
    {
        /**
         *
         */
        private element;

        /**
         *
         */
        public constructor(element)
        {
            this.element = element;
        }

        /**
         *
         */
        public get(context)
        {

            var instance;

            if (this.element) {
                if (typeof this.element.nodeName != "undefined") {

                    switch (this.element.nodeName) {
                        case "A":
                                instance = new View.A(context);
                            break;
                        case "ABBR":
                                instance = new View.Abbr(context);
                            break;
                        case "ADDRESS":
                                instance = new View.Address(context);
                            break;
                        case "AREA":
                                instance = new View.Area(context);
                            break;
                        case "ARTICLE":
                                instance = new View.Article(context);
                            break;
                        case "ASIDE":
                                instance = new View.Aside(context);
                            break;
                        case "AUDIO":
                                instance = new View.Audio(context);
                            break;
                        case "B":
                                instance = new View.B(context);
                            break;
                        case "BASE":
                                instance = new View.Base(context);
                            break;
                        case "BDI":
                                instance = new View.Bdi(context);
                            break;
                        case "BDO":
                                instance = new View.Bdo(context);
                            break;
                        case "BLOCKQUOTE":
                                instance = new View.Blockquote(context);
                            break;
                        case "BODY":
                                instance = new View.Body(context);
                            break;
                        case "BR":
                                instance = new View.Br(context);
                            break;
                        case "BUTTON":
                                instance = new View.Button(context);
                            break;
                        case "CANVAS":
                                instance = new View.Canvas(context);
                            break;
                        case "CAPTION":
                                instance = new View.Caption(context);
                            break;
                        case "CITE":
                                instance = new View.Cite(context);
                            break;
                        case "CODE":
                                instance = new View.Code(context);
                            break;
                        case "COL":
                                instance = new View.Col(context);
                            break;
                        case "COLGROUP":
                                instance = new View.ColGroup(context);
                            break;
                        case "DATALIST":
                                instance = new View.Datalist(context);
                            break;
                        case "DB":
                                instance = new View.Db(context);
                            break;
                        case "DEL":
                                instance = new View.Del(context);
                            break;
                        case "DETAILS":
                                instance = new View.Details(context);
                            break;
                        case "DFN":
                                instance = new View.Dfn(context);
                            break;
                        case "DIALOG":
                                instance = new View.Dialog(context);
                            break;
                        case "DIV":
                                instance = new View.Div(context);
                            break;
                        case "DL":
                                instance = new View.Dl(context);
                            break;
                        case "DT":
                                instance = new View.Dt(context);
                            break;
                        case "EM":
                                instance = new View.Em(context);
                            break;
                        case "EMBED":
                                instance = new View.Embed(context);
                            break;
                        case "FIELDSET":
                                instance = new View.Fieldset(context);
                            break;
                        case "FIGCAPTION":
                                instance = new View.Figcaption(context);
                            break;
                        case "FIGURE":
                                instance = new View.Figure(context);
                            break;
                        case "FOOTER":
                                instance = new View.Footer(context);
                            break;
                        case "FORM":
                                instance = new View.Form(context);
                            break;
                        case "H1":
                                instance = new View.H1(context);
                            break;
                        case "H2":
                                instance = new View.H2(context);
                            break;
                        case "H3":
                                instance = new View.H3(context);
                            break;
                        case "H4":
                                instance = new View.H4(context);
                            break;
                        case "H5":
                                instance = new View.H5(context);
                            break;
                        case "H6":
                                instance = new View.H6(context);
                            break;
                        case "HEAD":
                                instance = new View.Head(context);
                            break;
                        case "HEADER":
                                instance = new View.Header(context);
                            break;
                        case "I":
                                instance = new View.I(context);
                            break;
                        case "IFRAME":
                                instance = new View.Iframe(context);
                            break;
                        case "IMG":
                                instance = new View.Img(context);
                            break;
                        case "INPUT":
                                instance = new View.Input(context);
                            break;
                        case "INS":
                                instance = new View.Ins(context);
                            break;
                        case "KBD":
                                instance = new View.Kbd(context);
                            break;
                        case "KEYGEN":
                                instance = new View.Keygen(context);
                            break;
                        case "LABEL":
                                instance = new View.Label(context);
                            break;
                        case "LEYEND":
                                instance = new View.Leyend(context);
                            break;
                        case "LI":
                                instance = new View.Li(context);
                            break;
                        case "LINK":
                                instance = new View.Link(context);
                            break;
                        case "MAIN":
                                instance = new View.Main(context);
                            break;
                        case "MAP":
                                instance = new View.Map(context);
                            break;
                        case "MENU":
                                instance = new View.Menu(context);
                            break;
                        case "MENUITEM":
                                instance = new View.Menuitem(context);
                            break;
                        case "META":
                                instance = new View.Meta(context);
                            break;
                        case "META":
                                instance = new View.Meta(context);
                            break;
                        case "METER":
                                instance = new View.Meter(context);
                            break;
                        case "NAV":
                                instance = new View.Nav(context);
                            break;
                        case "NOSCRIP":
                                instance = new View.Noscrip(context);
                            break;
                        case "OBJECT":
                                instance = new View.Object(context);
                            break;
                        case "OL":
                                instance = new View.Ol(context);
                            break;
                        case "OPTGROUP":
                                instance = new View.Optgroup(context);
                            break;
                        case "P":
                                instance = new View.P(context);
                            break;
                        case "PARAM":
                                instance = new View.Param(context);
                            break;
                        case "PRE":
                                instance = new View.Pre(context);
                            break;
                        case "PROGRESS":
                                instance = new View.Progress(context);
                            break;
                        case "Q":
                                instance = new View.Q(context);
                            break;
                        case "RP":
                                instance = new View.Rp(context);
                            break;
                        case "RT":
                                instance = new View.Rt(context);
                            break;
                        case "RUBY":
                                instance = new View.Ruby(context);
                            break;
                        case "S":
                                instance = new View.S(context);
                            break;
                        case "SAMP":
                                instance = new View.Samp(context);
                            break;
                        case "SCRIPT":
                                instance = new View.Script(context);
                            break;
                        case "SECTION":
                                instance = new View.Section(context);
                            break;
                        case "SELECT":
                                instance = new View.Select(context);
                            break;
                        case "SMALL":
                                instance = new View.Small(context);
                            break;
                        case "SOURCE":
                                instance = new View.Source(context);
                            break;
                        case "SPAN":
                                instance = new View.Span(context);
                            break;
                        case "STRONG":
                                instance = new View.Strong(context);
                            break;
                        case "STYLE":
                                instance = new View.Style(context);
                            break;
                        case "SUB":
                                instance = new View.Sub(context);
                            break;
                        case "SUMMARY":
                                instance = new View.Summary(context);
                            break;
                        case "SUP":
                                instance = new View.Sup(context);
                            break;
                        case "TABLE":
                                instance = new View.Table(context);
                            break;
                        case "TBODY":
                                instance = new View.Tbody(context);
                            break;
                        case "TD":
                                instance = new View.Td(context);
                            break;
                        case "TEXTAREA":
                                instance = new View.Textarea(context);
                            break;
                        case "TFOOT":
                                instance = new View.Tfoot(context);
                            break;
                        case "TH":
                                instance = new View.Th(context);
                            break;
                        case "THEAD":
                                instance = new View.Thead(context);
                            break;
                        case "TIME":
                                instance = new View.Time(context);
                            break;
                        case "TITLE":
                                instance = new View.Title(context);
                            break;
                        case "TR":
                                instance = new View.Tr(context);
                            break;
                        case "TRACK":
                                instance = new View.Track(context);
                            break;
                        case "U":
                                instance = new View.U(context);
                            break;
                        case "UL":
                                instance = new View.Ul(context);
                            break;
                        case "VAR":
                                instance = new View.Var(context);
                            break;
                        case "VIDEO":
                                instance = new View.Video(context);
                            break;
                        case "WBR":
                                instance = new View.Wbr(context);
                            break;
                        default:
                                instance = new View.ViewElement();
                                instance.create(this.element.nodeName);
                            break;
                    }
                    instance.setElement(this.element);
                    return instance;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
}
