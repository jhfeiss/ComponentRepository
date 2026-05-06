export const POSITION_LIST: string[] = [
	"QB", //0
	"HB", //1
	"FB", //2
	"WR", //3
	"TE", //4
	"LT", //5
	"LG", //6
	"C", //7
	"RG", //8
	"RT", //9
	"LEDG", //10
	"REDG", //11
	"DT", //12
	"SAM", //13
	"WILL", //14
	"MIKE", //15
	"CB", //16
	"FS", //17
	"SS", //18
	"K", //19
	"P", //20
	"LS", //20
];

export const getPosition = (id: number) => POSITION_LIST[id];
