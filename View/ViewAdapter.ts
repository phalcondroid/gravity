
///<reference path="./Tag.ts"/>
///<reference path="./Elements/A.ts"/>
///<reference path="./Elements/Abbr.ts"/>
///<reference path="./Elements/Address.ts"/>
///<reference path="./Elements/Area.ts"/>
///<reference path="./Elements/Article.ts"/>
///<reference path="./Elements/Aside.ts"/>
///<reference path="./Elements/Audio.ts"/>
///<reference path="./Elements/B.ts"/>
///<reference path="./Elements/Base.ts"/>
///<reference path="./Elements/Bdi.ts"/>
///<reference path="./Elements/Bdo.ts"/>
///<reference path="./Elements/Blockquote.ts"/>
///<reference path="./Elements/Body.ts"/>
///<reference path="./Elements/Br.ts"/>
///<reference path="./Elements/Button.ts"/>
///<reference path="./Elements/Canvas.ts"/>
///<reference path="./Elements/Caption.ts"/>
///<reference path="./Elements/Cite.ts"/>
///<reference path="./Elements/Code.ts"/>
///<reference path="./Elements/Col.ts"/>
///<reference path="./Elements/ColGroup.ts"/>
///<reference path="./Elements/Datalist.ts"/>
///<reference path="./Elements/Db.ts"/>
///<reference path="./Elements/Del.ts"/>
///<reference path="./Elements/Details.ts"/>
///<reference path="./Elements/Dfn.ts"/>
///<reference path="./Elements/Dialog.ts"/>
///<reference path="./Elements/Div.ts"/>
///<reference path="./Elements/Dl.ts"/>
///<reference path="./Elements/Dt.ts"/>
///<reference path="./Elements/Em.ts"/>
///<reference path="./Elements/Embed.ts"/>
///<reference path="./Elements/Fieldset.ts"/>
///<reference path="./Elements/Figcaption.ts"/>
///<reference path="./Elements/Figure.ts"/>
///<reference path="./Elements/Footer.ts"/>
///<reference path="./Elements/Form.ts"/>
///<reference path="./Elements/H1.ts"/>
///<reference path="./Elements/H2.ts"/>
///<reference path="./Elements/H3.ts"/>
///<reference path="./Elements/H4.ts"/>
///<reference path="./Elements/H5.ts"/>
///<reference path="./Elements/H6.ts"/>
///<reference path="./Elements/Head.ts"/>
///<reference path="./Elements/Header.ts"/>
///<reference path="./Elements/I.ts"/>
///<reference path="./Elements/Iframe.ts"/>
///<reference path="./Elements/Img.ts"/>
///<reference path="./Elements/Input.ts"/>
///<reference path="./Elements/Ins.ts"/>
///<reference path="./Elements/Kbd.ts"/>
///<reference path="./Elements/Keygen.ts"/>
///<reference path="./Elements/Label.ts"/>
///<reference path="./Elements/Leyend.ts"/>
///<reference path="./Elements/Li.ts"/>
///<reference path="./Elements/Link.ts"/>
///<reference path="./Elements/Main.ts"/>
///<reference path="./Elements/Map.ts"/>
///<reference path="./Elements/Menu.ts"/>
///<reference path="./Elements/MenuItem.ts"/>
///<reference path="./Elements/Meta.ts"/>
///<reference path="./Elements/Meter.ts"/>
///<reference path="./Elements/Nav.ts"/>
///<reference path="./Elements/Noscrip.ts"/>
///<reference path="./Elements/Object.ts"/>
///<reference path="./Elements/Ol.ts"/>
///<reference path="./Elements/Optgroup.ts"/>
///<reference path="./Elements/Option.ts"/>
///<reference path="./Elements/Output.ts"/>
///<reference path="./Elements/P.ts"/>
///<reference path="./Elements/Param.ts"/>
///<reference path="./Elements/Pre.ts"/>
///<reference path="./Elements/Progress.ts"/>
///<reference path="./Elements/Q.ts"/>
///<reference path="./Elements/Rp.ts"/>
///<reference path="./Elements/Rt.ts"/>
///<reference path="./Elements/Ruby.ts"/>
///<reference path="./Elements/S.ts"/>
///<reference path="./Elements/Samp.ts"/>
///<reference path="./Elements/Script.ts"/>
///<reference path="./Elements/Section.ts"/>
///<reference path="./Elements/Select.ts"/>
///<reference path="./Elements/Small.ts"/>
///<reference path="./Elements/Source.ts"/>
///<reference path="./Elements/Span.ts"/>
///<reference path="./Elements/Strong.ts"/>
///<reference path="./Elements/Style.ts"/>
///<reference path="./Elements/Sub.ts"/>
///<reference path="./Elements/Table.ts"/>
///<reference path="./Elements/Tbody.ts"/>
///<reference path="./Elements/Td.ts"/>
///<reference path="./Elements/Textarea.ts"/>
///<reference path="./Elements/Tfoot.ts"/>
///<reference path="./Elements/Th.ts"/>
///<reference path="./Elements/Thead.ts"/>
///<reference path="./Elements/Time.ts"/>
///<reference path="./Elements/Title.ts"/>
///<reference path="./Elements/Tr.ts"/>
///<reference path="./Elements/Track.ts"/>
///<reference path="./Elements/U.ts"/>
///<reference path="./Elements/Ul.ts"/>
///<reference path="./Elements/Var.ts"/>
///<reference path="./Elements/Video.ts"/>
///<reference path="./Elements/Wbr.ts"/>

namespace Gravity.View
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
                                instance = new Gravity.View.A(context);
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
                                instance = new Gravity.View.Tag();
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
