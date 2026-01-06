import { CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Brain, Shield, FileSearch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { AnalysisData } from './AudioAnalyzer';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface AnalysisResultsProps {
  data: AnalysisData;
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const getStatusColor = () => {
    if (data.credibilityScore >= 70) return 'text-green-600 bg-green-500/10 border-green-500/20';
    if (data.credibilityScore >= 50) return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-600 bg-red-500/10 border-red-500/20';
  };

  const getStatusIcon = () => {
    if (data.credibilityScore >= 70) return <CheckCircle className="size-5" />;
    if (data.credibilityScore >= 50) return <AlertTriangle className="size-5" />;
    return <XCircle className="size-5" />;
  };

  const getStatusText = () => {
    if (data.credibilityScore >= 70) return '신뢰할 수 있음';
    if (data.credibilityScore >= 50) return '의심스러움';
    return '신뢰할 수 없음';
  };

  const pieData = [
    { name: '신뢰도', value: data.credibilityScore, fill: '#10b981' },
    { name: '의심도', value: 100 - data.credibilityScore, fill: '#ef4444' },
  ];

  const evidenceData = data.evidences.map((ev) => ({
    name: ev.category,
    영향도: ev.impact,
    fill: ev.type === 'positive' ? '#10b981' : '#ef4444',
  }));

  return (
    <div className="space-y-6">
      {/* 전체 결과 요약 */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">분석 결과</CardTitle>
              <CardDescription className="mt-2 text-base">{data.filename}</CardDescription>
            </div>
            <Badge className={`${getStatusColor()} px-4 py-2 text-base`} variant="outline">
              <span className="flex items-center gap-2">
                {getStatusIcon()}
                {getStatusText()}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 relative">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 신뢰도 점수 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border">
              <h3 className="text-base font-semibold mb-6">전체 신뢰도 점수</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center -mt-32 mb-24">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{data.credibilityScore}%</div>
                <div className="text-base text-muted-foreground mt-2 font-medium">신뢰도</div>
              </div>
            </div>

            {/* 근거 영향도 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-blue-500/5 border">
              <h3 className="text-base font-semibold mb-6">판단 근거별 영향도</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={evidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="영향도" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Separator />

          {/* 처리 과정 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border">
            <h3 className="text-base font-semibold mb-6">처리 과정</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {data.processingSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="size-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <CheckCircle className="size-6 text-white" />
                  </div>
                  <p className="text-xs font-semibold">{step.step.replace(' 중...', '')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추출된 텍스트 */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-blue-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileSearch className="size-5 text-blue-600" />
            </div>
            추출된 텍스트
          </CardTitle>
          <CardDescription className="text-base">영상에서 음성을 추출하여 변환한 텍스트입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl border-2 border-blue-500/20">
            <p className="text-base leading-relaxed">{data.transcribedText}</p>
          </div>
        </CardContent>
      </Card>

      {/* AI 요약 */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-purple-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Brain className="size-5 text-purple-600" />
            </div>
            AI 요약
          </CardTitle>
          <CardDescription className="text-base">텍스트 내용을 AI가 분석하여 요약한 결과입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-500/20 rounded-xl">
            <p className="text-base leading-relaxed">{data.summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* 신뢰도 근거 */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-orange-500/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Shield className="size-5 text-orange-600" />
            </div>
            신뢰도 판단 근거
          </CardTitle>
          <CardDescription className="text-base">
            AI가 {data.credibilityScore}% 신뢰도를 도출한 상세 근거입니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.evidences.map((evidence, index) => (
            <div key={index} className="space-y-3">
              <div className={`p-6 rounded-xl border-2 ${
                evidence.type === 'positive' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-500/20' 
                  : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 border-red-500/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl shadow-lg ${
                      evidence.type === 'positive'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}
                  >
                    {evidence.type === 'positive' ? (
                      <TrendingUp className="size-6 text-white" />
                    ) : (
                      <TrendingDown className="size-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">{evidence.category}</h4>
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 ${
                          evidence.type === 'positive'
                            ? 'text-green-700 bg-green-500/10 border-green-500/30'
                            : 'text-red-700 bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        {evidence.type === 'positive' ? '긍정적' : '부정적'}
                      </Badge>
                    </div>
                    <p className="text-base mb-4">
                      {evidence.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>영향도</span>
                        <span className="text-base font-bold">{evidence.impact}%</span>
                      </div>
                      <Progress value={evidence.impact} className="h-3" />
                    </div>
                  </div>
                </div>
              </div>
              {index < data.evidences.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 최종 판정 */}
      <Card className={`border-2 shadow-2xl ${data.isFake ? 'border-red-500/50 bg-gradient-to-br from-red-500/5 to-rose-500/5' : 'border-green-500/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            {data.isFake ? (
              <>
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <XCircle className="size-8 text-red-600" />
                </div>
                <span className="text-red-600">가짜 정보일 가능성이 높습니다</span>
              </>
            ) : (
              <>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <CheckCircle className="size-8 text-green-600" />
                </div>
                <span className="text-green-600">신뢰할 수 있는 정보입니다</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">
            {data.isFake ? (
              <>
                분석 결과, 이 콘텐츠는 신뢰도가 낮아 가짜 정보일 가능성이 높습니다.
                여러 근거를 바탕으로 판단한 결과이니 참고하시기 바랍니다.
              </>
            ) : (
              <>
                분석 결과, 이 콘텐츠는 신뢰할 수 있는 정보로 판단됩니다.
                다만, 항상 여러 출처를 교차 검증하는 것이 좋습니다.
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}