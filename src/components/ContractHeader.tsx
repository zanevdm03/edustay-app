import logo from "@/assets/logo.png";

const ContractHeader = () => (
  <div className="text-center space-y-2 pb-4">
    <div className="flex items-center justify-center gap-4">
      <img src={logo} alt="EduStay" className="h-16 w-16 object-contain" />
      <div className="text-left">
        <h2 className="text-xl font-serif text-foreground">EduStay</h2>
        <p className="text-xs text-muted-foreground">Accommodation</p>
      </div>
    </div>
    <div className="text-xs text-muted-foreground space-y-0.5">
      <p>Zané van der Merwe</p>
      <p>079 326 0041 • edustayaccommodation@gmail.com</p>
      <p>Bloemfontein, Free State, 9301</p>
    </div>
    <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] pt-1">Smart Living for Bright Futures</p>
    <p className="text-lg font-serif text-foreground mt-2">STUDENT LEASE AGREEMENT</p>
  </div>
);

export default ContractHeader;
