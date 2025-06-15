import OpenAI from 'openai'

export const useOpenAI = () => {
  const config = useRuntimeConfig()
  const apiKey = config.OPENAI_API_KEY as string | undefined

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in runtime config')
  }
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
}
