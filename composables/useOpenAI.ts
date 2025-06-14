import OpenAI from 'openai'

export const useOpenAI = () => {
  const config = useRuntimeConfig()
  const apiKey = config.OPENAI_API_KEY as string | undefined
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}
