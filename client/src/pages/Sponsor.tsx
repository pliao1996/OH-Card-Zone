import { Layout } from "@/components/ui/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import alipayQr from "@/assets/alipay_qr.jpg";
import wechatQr from "@/assets/wechat_qr.jpg";

export default function Sponsor() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">赞助支持</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            制作不易，感谢您的认可。如果这个应用对您有所帮助，欢迎打赏支持，数额不限。您的支持是我持续优化和维护的最大动力。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-[#00A0E9]">支付宝</h3>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-inner bg-slate-50">
                <img 
                  src={alipayQr} 
                  alt="支付宝收款码" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-colors">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-[#07C160]">微信支付</h3>
              <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-inner bg-slate-50">
                <img 
                  src={wechatQr} 
                  alt="微信收款码" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <p className="text-center mt-12 text-sm text-muted-foreground">
          扫码即可完成打赏，愿这份连接带给你更多内在的宁静。
        </p>
      </div>
    </Layout>
  );
}
