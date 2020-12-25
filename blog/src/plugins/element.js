import Vue from 'vue'
import {
    Button,
    Container,
    Header,
    Main,
    Footer,
    Form,
    FormItem,
    Input,
    Message,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Avatar,
    Upload,
    DatePicker,
    Col,
    RadioGroup,
    Radio,
    Dialog,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Tag,
    Select,
    Option,
    MessageBox,
    Backtop,
    Pagination,
    Card,
    Table,
    TableColumn,
    Badge,
} from 'element-ui'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Avatar)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Backtop)
Vue.use(Pagination)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Badge)

Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert